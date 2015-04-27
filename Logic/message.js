module.exports = function (socket, myname) {
  var messagemodel = require("../module/message.js");
  var now = 0, datajson = {};

  messagemodel.getmessage(function (Message) {
    Message.find({}).sort({time : -1}).limit(20).exec(function (err, data) {
      if (err) {
        console.error(err)
      } else {
        socket.emit("history message", data);
        socket.broadcast.emit("history message", data);
      }
    });
  });

  socket.on("to server", function (data) {
    now = new Date().getTime();

    datajson = { // 插入数据库
      from: myname,
      to: "all",
      content: data.message,
      type: "public",
      time: now
    };

    messagemodel.savemessage(datajson, function(err) {
      if (err) {
        console.error(err)
      } else {
        console.log(datajson);
      }
    });

    socket.emit("to broswer", {  // to me
      username : myname,
      message : data.message,
      date : now
    });

    socket.broadcast.emit("to broswer", { // to all
      username : myname,
      message : data.message,
      date : now
    });
  });
};