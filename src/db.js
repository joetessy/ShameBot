const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
const url = 'mongodb://jg_user:jgpwd2019@ds151354.mlab.com:51354/jg_slack_users';
var Schema = mongoose.Schema;

const addOrUpdateUserAndBannedWords = function(user_name, bannedWords) {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db("jg_slack_users");
    const ObjectId = Schema.ObjectId;

    // check if user exists in collection; if so update counts, else create new
    if (db.user_msg.find({ user_name: user_name }).count() == 1) {
      updateUser(db, user_name, bannedWords);
    } else {
      createUser(db, user_name, bannedWords);
    }

    // add banned word to collection
    addOrUpdateBannedWords(db, bannedWords);

    client.close();
  });
};

function createUser(db, user_name, bannedWords) {
  var wordArr = [];
  for (var i = 0; i < bannedWords.length; i++) {
    wordArr.push({ word: bannedWords[i], count: 1 });
  }

  db.user_msg.insertOne({
    u_id: ObjectId,
    user_name: user_name,
    banned_words: wordArr,
    date: Date
  });
}

function updateUser(db, user_name, bannedWords) {
  for (var i = 0; i < bannedWords.length; i++) {
    db.user_msg.update({ user_name: user_name , "banned_words.word": bannedWords[i] }, {$inc:{"banned_words.$.count":1}});
  }
}

function addOrUpdateBannedWords(db, bannedWords) {
  for (var i = 0; i < bannedWords.length; i++) {
    if (db.banned_words.find({ word: bannedWords[i] }).count() == 1) {
      db.banned_words.update({ word: bannedWords[i] }, { $inc: { count: 1 } });
    } else {
      db.banned_words.insertOne({
        word: bannedWords[i],
        count: 1
      });
    }
  }
}
