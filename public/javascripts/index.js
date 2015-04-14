var socket = io.connect('http://' + window.location.hostname + ':3000');

function get (id, tag) {
  if (tag) {
    var tagname, tagindex;
    /([a-z]+)(\d+)/.test(tag);
    tagname = RegExp.$1;
    tagindex = Number(RegExp.$2);

    return document.getElementById(id).getElementsByTagName(tagname)[tagindex];
  } else {
    return document.getElementById(id);
  }
}

function Chatroom(){
  this.logintext = get("login","input0");
  this.loginbtn = get("login","input1");
  this.countobj = get("count","span0");
  this.showobj = get("message","ul0");
  this.userlist = get("userlist","ol0");
  this.messagetext = get("send","input0");
  this.messagebtn = get("send","input1");
}

/* 登陆功能开始 */

Chatroom.prototype.doLogin = function(){ // 登陆
  var that = this;

  that.loginbtn.onclick = function(){ // 点击登陆按钮
    that.loginVerification();
  };

  that.doKeydown(that.logintext, that.loginVerification); // 回车提交
};

Chatroom.prototype.loginVerification = function(){ // 登陆验证
  var that = this;

  if (that.logintext.value.replace(/^\s+|\s+$/, "") === "") { // 空名字验证
    alert("用户名不嫩为空");
    that.logintext.value = "";
    return;
  }

  if (that.logintext.value.length >= 8) { // 大于8位名字验证
    alert("此名太长太拉轰，名字长度应为1~8个字符。");
    return;
  }

  if (/.*(李|li)?.*(鹏|朋|peng).*/gi.test(that.logintext.value)) { // 防被黑验证
    alert("黑我的推出去枪毙五分钟。");
    return false;
  }

  socket.emit("login", that.logintext.value, function (boolean) { // 防止重名验证
    if (boolean) {
      get("l").style.display = "none";
      get("d").style.display = "block";
      that.loadUser();
      that.doMessage();
    } else {
      alert("用户名已经存在");
    }
  });
};

/* 用户系统开始 */

Chatroom.prototype.loadUser = function(){ // 载入用户
  var that = this;

  socket.on('user', function (data) {
    var length = data.count.length,
        listhtml = "";

    that.countobj.innerHTML = length; // 载入在线人数

    for (var i = 0; i < length; i++) {
      listhtml += "<li>" + data.count[i] + "</li>"
    }

    that.userlist.innerHTML = listhtml; // 载入用户列表
  });
};

/* 聊天系统开始 */

Chatroom.prototype.doMessage = function(){ // 聊天
  var that = this;

  that.messagebtn.onclick = function(){
    that.sendMessage();
    return false;
  };

  that.doKeydown(that.messagetext, that.sendMessage);
  that.getMessage();
};

Chatroom.prototype.sendMessage = function(){ // 发信息
  var that = this;

  if (that.messagetext.value.replace(/^\s+|\s+$/, "") === ""){ // 发送信息为空的验证
    return;
  }

  socket.emit("to server", { message : that.messagetext.value });
  that.messagetext.value = ""; // 发送完清空信息
};

Chatroom.prototype.getMessage = function(){ // 收信息
  var that = this;

  socket.on('to broswer', function (data) {
    that.showobj.innerHTML += "<li>" +
      "<div><em class='text-primary'>" + data.username + ":</em></div>" +
      "<div>" + data.message + "</div>" +
    "</li>";

    that.autoScroll();
  });
};

Chatroom.prototype.autoScroll = function(){ // 自动滚动功能
  var outer = get("message", "div0"), that = this;

  if (parseInt(that.showobj.offsetHeight) - parseInt(outer.offsetHeight) > 0) { // 聊天内容区域 > 限制区域
    outer.scrollTop = parseInt(that.showobj.offsetHeight) - parseInt(outer.offsetHeight);
  }
}
/* 工具方法开始 */

Chatroom.prototype.doKeydown = function (obj, callback) { // 键盘按下
  var that = this;

  obj.onkeydown = function (ev) {
    var ev = window.event || ev;

    if (ev.keyCode === 13) {
      callback && callback.call(that);
    }
  };
}

Chatroom.prototype.init = function(){ // 初始化方法
  this.doLogin();
};