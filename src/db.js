const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
const url = 'mongodb://jg_user:jgpwd2019@ds151354.mlab.com:51354/jg_slack_users';
var Schema = mongoose.Schema;

const addOrUpdateUserAndBannedWords = function(user_name, bannedWords) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);

    const db = client.db("jg_slack_users");

    // check if user exists in collection; if so update counts, else create new
    if (db.collection('user_msg').find({ user_name: user_name }).count() > 0) {
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
  const ObjectId = Schema.ObjectId;

  var wordArr = [];
  for (var i = 0; i < bannedWords.length; i++) {
    wordArr.push({ word: bannedWords[i], count: 1 });
  }

  db.collection('user_msg').insertOne({
    u_id: ObjectId,
    user_name: user_name,
    banned_words: wordArr,
    date: Date
  });
}

function updateUser(db, user_name, bannedWords) {
  // add new words w/count of 1, update existing words by incrementing count

  var newBannedWords = new Set(bannedWords);
  var knownBannedWords = db.collection('user_msg').findOne({user_name: user_name}).banned_words.map(x => x.word);

  for (var i = 0; i < newBannedWords.length; i++) {
    // update count if word already used by user; else add new word
    if (knownBannedWords.includes(newBannedWords[i])) {
      db.collection('user_msg').update({ user_name: user_name , "banned_words.word":newBannedWords[i]}, {$inc: {"banned_words.$.count":1} });
    } else {
      db.collection('user_msg').update({ user_name: user_name } , { $push: {banned_words: {word: newBannedWords[i], count: 1}} });
    }
  }
}

function addOrUpdateBannedWords(db, bannedWords) {
  for (var i = 0; i < bannedWords.length; i++) {
      db.collection('banned_words').updateOne(
        { word: bannedWords[i] },
        { $inc: { count: 1 } },
        { upsert : true });
  }
}

module.exports = addOrUpdateUserAndBannedWords;
