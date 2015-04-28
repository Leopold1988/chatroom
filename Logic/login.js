module.exports = function (socket, mongoose, namelist, loginout) {
  var messageModule = require("./message.js");
  var myname = "";

  socket.on("login", function (data, callback) {
    if (namelist.indexOf(data) != -1) {
      callback(false);
      return;
    }

    if (data.replace(/^\s+|\s+$/, "") === "") { // 空名字验证
      callback("用户名不嫩为空");
      return;
    }

    if (data.length >= 8) { // 大于8位名字验证
      callback("此名太长太拉轰，名字长度应为1~8个字符。");
      return;
    }

    if (/.*(李|li)+.*(鹏|朋|peng|月|月鸟)*.*/gi.test(data)) { // 防被黑验证
      callback("黑我的推出去枪毙五分钟。");
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