module.exports = function (socket, myname) {
  var now = 0;

  var mongoose = require('mongoose');
  var db = mongoose.connection;

  socket.on("to server", function (data) {
    now = new Date().getTime();

    // db.on('error', console.error);
    // db.once('open', function() {


    //   // Create your schemas and models here.
    //   console.log("open success");
    // });

    var movieSchema = new mongoose.Schema({
      from: String
    , to: String
    , content: String
    , type: String
    , time: Date
    });

    var Movie = mongoose.model('Movie', movieSchema);
    var thor = new Movie({ // 插入数据库
      from: myname,
      to: "all",
      content: data.message,
      type: "public",
      time: now
    });

    thor.save(function(err, thor) {
      if (err) return console.error(err);
      console.dir(thor);
    });

    mongoose.connect('mongodb://localhost/abc');



    // mongoose({ // 插入数据库
    //   from: myname,
    //   to: "all",
    //   content: data.message,
    //   type: "public",
    //   time: now
    // }, "message");

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