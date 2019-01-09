var jiraMatcher = function(message, user) {
  var regEx = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g
  var message = message.split("").reverse().join("");
  var m = message.match(regEx);
  
  if (m){
    var issues = []
    m.forEach(function(issue){
      issues.push(issue.split("").reverse().join(""));
    });
    return jiraResponse(issues, user)
  }
}

var jiraResponse = function(responses, user){
  var response = ` <@${user}>, :face_with_rolling_eyes: :face_with_rolling_eyes: :face_with_rolling_eyes: :face_with_rolling_eyes: PlEaSe dO It LiKe dIs, iTs EaSy: `
  responses.forEach((function(issue){
    response += `\n https://jira.jungroup.com/browse/${issue}`;
  }));
  return response;
};

module.exports = jiraMatcher;