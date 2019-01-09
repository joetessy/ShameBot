module.exports = function(words, user){
  words = words.slice(0);
  if ( words.length === 1 ) {
    var word = words;
    var response1 = `What a shame. <@${user}> just used the banned word: *${word}* :rage:`;
    var response2 = `Oh <@${user}>. You just used *${word}*, which is banned. How shameful.`;
    var response3 = `EMERGENCY!! *${word}* is a banned word, <@${user}>. Figure your life out! :weary:`;
    var response4 = `<@${user}> is on thin ice, obviously *${word}* is BANNED. :face_with_raised_eyebrow:`;
    var response5 = `:police_car::police_car: Call the police!! <@${user}> has used the banned word: *${word}*.`;
    var response6 = `Be careful of using *${word}*, its *banned*, <@${user}> :face_with_symbols_on_mouth:!`;
    var response7 = `<@${user}>, you should be ashamed of yourself, *${word}* is a banned words`;    
  } else {
    last_word = words[words.length - 1];
    last_word = `and ${last_word}`;
    words[words.length - 1] = last_word;
    var words = words.join(', '); 
    var response1 = `Oh heavens, <@${user}> has used the banned words: *${words}*. Good grief :sob:`;
    var response2 = `Holy Moly - *${words}* are all banned. <@${user}>, you know better than that! :dizzy_face:`;
    var response3 = `The shame... I can't believe <@${user}> was so short-sighted to use the banned words: *${words}*.`;
    var response4 = `*${words}* are all banned, <@${user}> :face_palm:`;
    var response5 = `:scream: Mayday! Mayday! <@${user}> is using the banned words: *${words}!!* SHAME`;
    var response6 = `<@${user}>, grow up! You know better than this: *${words}* are all banned words bozo.`;
    var response7 = `:face_with_monocle: <@${user}>, don't you know *${words}* are banned?!`;
  }

  var responses = [response1, response2, response3, response4, response5, response6, response7];
  return responses[Math.floor(Math.random() * responses.length)]; 
}