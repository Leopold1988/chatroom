var mongodb = require('../config/mongodb.js');
var mongoose = mongodb.mongoose;

var messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  content: String,
  type: String,
  time: Number
});

var Message = mongoose.model('message', messageSchema);

var MessageOO = function(){};

MessageOO.prototype.savemessage = function (savejson, callback) {
  var instance = new Message(savejson);

  instance.save(function(err){
    callback(err);
  });
};

MessageOO.prototype.getmessage = function (callback) {
  // Message.find(findjson, function(err, findjson){
  //   callback(err, findjson);
  // });
  callback(Message);
};

module.exports = new MessageOO();