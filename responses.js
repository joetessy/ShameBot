module.exports = function(words, user){
  if ( words.length === 1 ) {
    var word = words;
    var response1 = `Shame on you! <@${user}> You've used a banned word. *${word}* is not allowed!`
    var response2 = `Oh <@${user}>. You just used *${word}*, which is banned. How shamefull.`
    var response3 = `Emergency!! *${word}* is a banned word, <@${user}>! Figure your life out!`
    var response4 = `<@${user}> is on thin ice, obviously *${word}* is BANNED.`
    var response5 = `Call the police!! <@${user}> has used the banned word: *${word}*. Disgusting!!`
    var response6 = `Quit using *${word}*, ITS *BANNED*, <@${user}>!`
    
  } else {
    last_word = words[words.length - 1];
    last_word = `and ${last_word}`;
    words[words.length - 1] = last_word;

    var words = words.join(', ');
    console.log(words);
    console.log(last_word);

    var response1 = `Oh heavens, <@${user}> has used the banned words: *${words}*. Good grief`;
    var response2 = `Holy Moly - *${words}* are all banned. <@${user}>, you know better!`;
    var response3 = `The shame... I can't believe <@${user}> was so short-sighted to use the banned words: *${words}*.`;
    var response4 = `*${words}* are all banned, <@${user}> :face-palm.`;
    var response5 = `Mayday! Mayday! <@${user}> is using the banned words: *${words}!!* SHAME`;
    var response6 = `<@${user}>, grow up! You know better, *${words}* are all banned.`
  }

  var responses = [response1, response2, response3, response4, response5, response6]  
  return responses[Math.floor(Math.random() * responses.length)]      
}