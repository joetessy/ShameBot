require('dotenv').config();

const banned_words = require('./banned_words.js');
const respond = require('./responses.js');
const app = require('./app.js');

const { initializeAuthHelpers, getClientByTeamId } = require('./auth.js');


const start_server = require('./server.js');
const slackEventsApi = require('@slack/events-api');

const slackEvents = slackEventsApi.createEventAdapter(process.env.SLACK_SIGNING_SECRET, {
  includeBody: true
});

app.use('/slack/events', slackEvents.expressMiddleware());

initializeAuthHelpers();

slackEvents.on('message', (message, body) => {
  if (!message.subtype) {
    var words = [];
    for (var i = 0; i < banned_words.length; i++){
      var word = banned_words[i];
      if (message.text.includes(word)){
        words.push(word);
      }
    }
    const slack = getClientByTeamId(body.team_id);
    if (!slack) {
      return console.error('No authorization found for this team. Did you install the app through the url provided by ngrok?');
    }
    var response = respond(words, message.user);
    slack.chat.postMessage({ 
      channel: message.channel, 
      text: response})
    .catch(console.error);
  }
});

slackEvents.on('error', (error) => {
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.log(errorWithCode)
    console.error(`Received unverified request: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(`An error occurred while handling a Slack event: ${error.message}`);
  }
});

start_server(app);