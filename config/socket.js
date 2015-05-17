module.exports = function (server) {
  var io = require('socket.io').listen(server);
  var rest = require('restler');
  // var mongoose = require('../config/mongodb.js');
  var loginModule = require('../Logic/login.js');
  var namelist = [];

  io.sockets.on('connection', function (socket) {

    socket.on('getTag', function (data, callback) {
      rest.get(data.url).on('complete', function(data) {
        callback && callback({ data : JSON.parse(data) });
      });
    });

    socket.on('screeningTag', function (data, callback) {
      rest.get(data.url).on('complete', function(data) {
        callback && callback({ data : JSON.parse(data) });
      });
    });


    // loginModule(socket, mongoose, namelist, function (namelist, myname) {
    //   socket.on('disconnect', function(){
    //     if (!myname) return;
    //     if (namelist.indexOf(myname) > -1) {
    //       namelist.splice(namelist.indexOf(myname), 1);
    //       socket.broadcast.emit('user', { 'namelist' : namelist });
    //     }
    //   });
    // });
  });
};