const passport = require('passport');
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy;
const SlackClient = require('@slack/client').WebClient;
const LocalStorage = require('node-localstorage').LocalStorage;

const botAuthorizationStorage = new LocalStorage('./storage');

function initializeAuthHelpers(){
  passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    skipUserProfile: true,
  }, (accessToken, scopes, team, extra, profiles, done) => {
    botAuthorizationStorage.setItem(team.id, extra.bot.accessToken);
    done(null, {});
  }));  
}

const clients = {};
function getClientByTeamId(teamId) {
  if (!clients[teamId] && botAuthorizationStorage.getItem(teamId)) {
    clients[teamId] = new SlackClient(botAuthorizationStorage.getItem(teamId));
  }
  if (clients[teamId]) {
    return clients[teamId];
  }
  return null;
}

module.exports = { initializeAuthHelpers, getClientByTeamId };