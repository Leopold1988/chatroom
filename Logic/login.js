module.exports = function (socket, mongoose, namelist, loginout) {
  var messageModule = require("./message.js");
  var myname = "";

  socket.on("login", function (data, callback) {
    if (namelist.indexOf(data) != -1) {
      callback(false);
      return;
    }

    callback(true);
    namelist.push(data);
    myname = namelist[namelist.length - 1];

    socket.emit('user', { 'namelist' : namelist });
    socket.broadcast.emit('user', { 'namelist' : namelist });

    messageModule(socket, myname);
    loginout(namelist, myname);
  });
};