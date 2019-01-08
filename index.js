require('dotenv').config();

const http = require('http');
const app = require('./src/app.js');
const { initializeAuthHelpers } = require('./src/auth.js');
const slackEvents = require('./src/slack_events.js')

app.use('/slack/events', slackEvents.expressMiddleware());
initializeAuthHelpers();

const port = process.env.PORT || 3000;
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`);
});