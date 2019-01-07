module.exports = function(words, user){
  if ( words.length === 1 ) {
    var word = words;
    var response1 = `Shame on you! <@${user}> You've used a banned word. *${word}* is not allowed! :rage:`;
    var response2 = `Oh <@${user}>. You just used *${word}*, which is banned. How shameful.`;
    var response3 = `EMERGENCY!! *${word}* is a banned word, <@${user}>! Figure your life out! :weary:`;
    var response4 = `<@${user}> is on thin ice, obviously *${word}* is BANNED.`;
    var response5 = `911 Call the police!! <@${user}> has used the banned word: *${word}*. Disgusting!! :face_vomiting:`;
    var response6 = `Quit using *${word}*, ITS *BANNED*, <@${user}>!`;
    
  } else {
    last_word = words[words.length - 1];
    last_word = `and ${last_word}`;
    words[words.length - 1] = last_word;
    var words = words.join(', ');
    var response1 = `Oh heavens, <@${user}> has used the banned words: *${words}*. Good grief :sob:`;
    var response2 = `Holy Moly - *${words}* are all banned. <@${user}>, you know better!`;
    var response3 = `The shame... I can't believe <@${user}> was so short-sighted to use the banned words: *${words}*.`;
    var response4 = `*${words}* are all banned, <@${user}> :face-palm:`;
    var response5 = `Mayday! Mayday! <@${user}> is using the banned words: *${words}!!* SHAME`;
    var response6 = `<@${user}>, grow up! You know better than this: *${words}* are all banned words bozo.`;
  }

  var responses = [response1, response2, response3, response4, response5, response6]  
  return responses[Math.floor(Math.random() * responses.length)]      
}