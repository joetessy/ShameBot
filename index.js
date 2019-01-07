require('dotenv').config();
const banned_words = require('./src/banned_words.js');
const respond = require('./src/responses.js');
const app = require('./src/app.js');
const { initializeAuthHelpers, getClientByTeamId } = require('./src/auth.js');
const start_server = require('./src/server.js');
const slackEventsApi = require('@slack/events-api');

const slackEvents = slackEventsApi.createEventAdapter(process.env.SLACK_SIGNING_SECRET, {
  includeBody: true
});

app.use('/slack/events', slackEvents.expressMiddleware());

initializeAuthHelpers();

slackEvents.on('message', (message, body) => {
  if (!message.subtype && message.type !== 'app_mention') {
    var words = [];
    for (var i = 0; i < banned_words.length; i++){
      var word = banned_words[i];
      if (message.text.toLowerCase().includes(word)){
        words.push(word);
      }
    }
    const slack = getClientByTeamId(body.team_id);
    if (!slack) {
      return console.error('No authorization found for this team.');
    }

    if (words.length > 0){
      var response = respond(words, message.user);
      slack.chat.postMessage({ 
        channel: message.channel, 
        text: response})
      .catch(console.error);
    }
  }
});

slackEvents.on('app_mention', (message, body) => {
  if (!message.subtype) {
    const slack = getClientByTeamId(body.team_id);
    if (!slack) {
      return console.error('No authorization found for this team.');
    }
    var response = `HELLO <@${message.user}> The following words are BANNED: *${banned_words.join(', ')}*. Be warned. You will be shamed for using these words.`;

    slack.chat.postMessage({ 
      channel: message.channel, 
      text: response})
    .catch(console.error);
  }
});

slackEvents.on('error', (error) => {
  console.log(error);
  if (error.code === slackEventsApi.errorCodes.TOKEN_VERIFICATION_FAILURE) {
    console.log(errorWithCode)
    console.error(`Received unverified request: \
${JSON.stringify(error.body)}`);
  } else {
    console.error(`An error occurred while handling a Slack event: ${error.message}`);
  }
});

start_server(app);