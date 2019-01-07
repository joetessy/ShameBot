const http = require('http');

module.exports = function(app){
  const port = process.env.PORT || 3000;
  http.createServer(app).listen(port, () => {
    console.log(`server listening on port ${port}`);
  });
}