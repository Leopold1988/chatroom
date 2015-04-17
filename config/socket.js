module.exports = function (server) {
  var io = require('socket.io').listen(server);
  var count = 0;
  var username = [];

  io.sockets.on('connection', function (socket) {
    socket.on("login", function (data, callback) {
      if (username.indexOf(data) != -1) {
        callback(false);
        return;
      }

      callback(true);
      username.push(data);
      socket.username = data;

      count++;
      socket.emit('user', { 'count' : username });
      socket.broadcast.emit('user', { 'count' : username });

      socket.on("to server", function (data) {
        socket.emit("to broswer", { username : socket.username, message : data.message ,date : new Date().getTime()});
        socket.broadcast.emit("to broswer", { username : socket.username, message : data.message ,date : new Date().getTime()});
      });
    });

    socket.on('disconnect', function(){
      if (!socket.username) return;
      if (username.indexOf(socket.username) > -1) {
        username.splice(username.indexOf(socket.username), 1);
        count--;
        socket.broadcast.emit('user', { 'count' : username });
      }
    });
  });
};