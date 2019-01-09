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
    if (db.collection('user_msg').find({ user_name: user_name }).count() == 1) {
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
  for (var i = 0; i < bannedWords.length; i++) {
    db.collection('user_msg').updateOne({ user_name: user_name , "banned_words.word": bannedWords[i] }, {$inc:{"banned_words.$.count":1}});
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

function retrieveCounts(callback, callback2) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db("jg_slack_users");
    
    var result = [];
    var records = db.collection('banned_words').find().sort({count:-1}).limit(5);

    records.each(function (err, doc) {
          if (doc != null) {
            result.push([doc.word, doc.count]);
          } else {
            callback(result, callback2);
          }
      });
    client.close();
  });
}

module.exports = { addOrUpdateUserAndBannedWords, retrieveCounts };