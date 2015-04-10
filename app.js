var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var fs = require('fs');

var app = express();

app.set('port', process.env.PORT || 3000);
// 设置程序所用的views文件夹，即模板文件夹。__dirname代表当前执行js所在的文件夹路径。另外，__filename代表当前执行文件的文件名
app.set('views', path.join(__dirname, 'views'));

/*
设置express所用的模板引擎为jade，express支持多种模板引擎，常用的有，常用的有：

haml的实现Haml
haml.js接替者，同时也是Express的默认模板引擎Jade
嵌入JavaScript模板EJS
基于CoffeeScript的模板引擎CoffeeKup
的NodeJS版本jQuery模板引擎
*/
app.set('view engine', 'jade');

// 设置程序的图标为express的图标，并将工作日志打印到后台显示。
app.use(favicon());
app.use(logger('dev'));

// 没有这个中间件Express就不知道怎么处理这个请求，通过bodyParser中间件分析 application/x-www-form-urlencoded和application/json请求，并把变量存入req.body，这种我们才能够获取到！
// var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// fs.readFile('txt/1.txt', 'utf8', function (err, data) {
//   if (!err) {
//     console.log(data);
//   } else {
//     throw err;
//   }
// });

// fs.writeFile('txt/1.txt', '水水水水水水水水', function (err, data) {
//   if (!err) {
//     console.log("写入成功");
//   } else {
//     throw err;
//   }
// });

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');

// var Cat = mongoose.model('Cat', { name: String });

// var kitty = new Cat({ name: 'Zildjian' });
// kitty.save(function (err) {
//   if (err) // ...
//   console.log('meow');
// });


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

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
      socket.emit("to broswer", { username : socket.username, message : data.message });
      socket.broadcast.emit("to broswer", { username : socket.username, message : data.message });
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
