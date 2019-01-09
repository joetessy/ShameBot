const slackEventsApi = require('@slack/events-api');
const bannedWords = require('./banned_words.js');
const respond = require('./responses.js');
const { addOrUpdateUserAndBannedWords, retrieveCounts } = require('./db.js');


const { getClientByTeamId } = require('./auth.js');
const jiraMatcher = require('./jira_matcher.js');
const buildTable =require('./table_builder.js');

const slackEvents = slackEventsApi.createEventAdapter(process.env.SLACK_SIGNING_SECRET, {
  includeBody: true
});

slackEvents.on('message', (message, body) => {
  if (!message.subtype && message.type !== 'app_mention' && message.user) {    
    var words = [];
    for (var i = 0; i < bannedWords.length; i++){
      var word = bannedWords[i];
      if (message.text.toLowerCase().includes(word)){
        words.push(word);
      }
    }
    addOrUpdateUserAndBannedWords(message.user, words);

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

      // add data to db
    }

    var jiraMessage = jiraMatcher(message.text, message.user);
    if (jiraMessage){
      slack.chat.postMessage({ 
        channel: message.channel, 
        text: jiraMessage})
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
    if (message.text.toLowerCase().includes('shameboard')){
      var response = `SHAMEBOARD`;
      callback = function(response){
        slack.chat.postMessage({
          channel: message.channel,
          text: response})
        .catch(console.error);
      }
      var data = retrieveCounts(buildTable, callback, 'banned_words');
      var data = retrieveCounts(buildTable, callback, 'user_msgs')

    } else {
      var response = `HELLO <@${message.user}> The following words are banned: *${bannedWords.join(', ')}*. Be warned. You will be shamed for using these words.`;
          slack.chat.postMessage({
            channel: message.channel,
            text: response})
          .catch(console.error);
    }
  }
});

slackEvents.on('member_joined_channel', (message, body) => {
  const slack = getClientByTeamId(body.team_id);
  if (!slack) {
    return console.error('No authorization found for this team.');
  }
  var greeting = `Greetings I am ShameBot. I will shame you for using banned words. Here is how you can interact with me: \n\n` +
  `>>> *@ShameBot:* Displays banned words.\n`+ 
  `*@ShameBot shameboard:* Leaderboard most frequently used bad words and the worst offenders.\n` +
  `*Any Jira issue* (ex: PLAYER-1234) will be replaced with a full link`;
      slack.chat.postMessage({
        channel: message.channel,
        text: greeting})
      .catch(console.error);
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

module.exports = slackEvents;


