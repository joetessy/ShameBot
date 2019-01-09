const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
const url = 'mongodb://jg_user:jgpwd2019@ds151354.mlab.com:51354/jg_slack_users';
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(url);

var userMsgSchema = new mongoose.Schema( {
  u_id: mongoose.Types.ObjectId,
  user_name: String,
  banned_words_count: Number,
  date: Date
});

var bannedWordSchema = new mongoose.Schema( {
  word: String,
  count: Number
});

var UserMsg = mongoose.model("user_msg", userMsgSchema);
var BannedWord = mongoose.model("banned_word", bannedWordSchema);

const addOrUpdateUserAndBannedWords = function(user_name, bannedWords) {
  var uniqueNewBannedWords = new Set(bannedWords);
  var nNewBannedWords = Array.from(uniqueNewBannedWords.values()).length;
  UserMsg.findOneAndUpdate(
    {user_name: user_name},
    {$inc : {banned_words_count: nNewBannedWords}},
    {upsert: true},
    function(err, doc) {
      if (err) {
        console.log(`UPDATE ERROR`);
      } else {
        console.log(`Added user: ${doc.user_name}`);
    }
  });

  addOrUpdateBannedWords(bannedWords);

};

function addOrUpdateBannedWords(bannedWords) {
  for (var i = 0; i < bannedWords.length; i++) {
    BannedWord.findOneAndUpdate(
        {word: bannedWords[i]},
        { $inc: {count: 1} },
        { upsert: true },
        function(err, doc) {
          if (err) {
            console.log(`UPDATE ERROR`);
          } else {
            console.log(`Added banned_words: ${doc.word}`);
          }
      });
    }
}

module.exports = addOrUpdateUserAndBannedWords;
