var socket = io.connect('http://' + window.location.hostname + ':3000');
var countobj, showobj, logintext, userlist, loginbtn, messagetext, messagebtn;

logintext = document.getElementById("login").getElementsByTagName("input")[0];
loginbtn = document.getElementById("login").getElementsByTagName("input")[1];
countobj = document.getElementById("count").getElementsByTagName("span")[0];
showobj = document.getElementById("message").getElementsByTagName("ul")[0];
userlist = document.getElementById("userlist").getElementsByTagName("ol")[0];
messagetext = document.getElementById("send").getElementsByTagName("input")[0];
messagebtn = document.getElementById("send").getElementsByTagName("input")[1];

function dologin(){
  loginbtn.onclick = function(){
    dologinin();
  };

  dokeydown(logintext, dologinin);
}

function sendmessage(){
  if (messagetext.value.replace(/^\s+|\s+$/, "") === ""){
    return;
  }
  socket.emit("to server", { message : messagetext.value });
  messagetext.value = "";
}

function dokeydown (obj, callback) {
  obj.onkeydown = function (ev) {
    var ev = window.event || ev;

    if (ev.keyCode === 13) {
      callback && callback();
    }
  };
}

function dologinin(){
  if (logintext.value.replace(/^\s+|\s+$/, "") === "") {
    alert("用户名不嫩为空");
    logintext.value = "";
    return;
  }

  if (logintext.value.length >= 8) {
    alert("此名太长太拉轰，名字长度应为1~8个字符。");
    return;
  }

  if (/.*(李|li)?.*(鹏|朋|peng).*/gi.test(logintext.value)) {
    alert("黑我的推出去枪毙五分钟。");
    return false;
  }

  socket.emit("login", logintext.value, function (boolean) {
    if (boolean) {
      document.getElementById("l").style.display = "none";
      document.getElementById("d").style.display = "block";
      domessage();
    } else {
      alert("用户名已经存在");
    }
  });
}

function domessage(){
  showobj.onscroll = function (ev) {
    var ev = window.event || ev;
    ev.cancelbubble = true;
  };

  messagebtn.onclick = function(){
    sendmessage();
    return false;
  };

  dokeydown(messagetext, sendmessage);

  socket.on('user', function (data) {
    var length = data.count.length,
        listhtml = "";

    countobj.innerHTML = length;
    for (var i = 0; i < length; i++) {
      listhtml += "<li>" + data.count[i] + "</li>"
    }

    userlist.innerHTML = listhtml;
  });

  socket.on('to broswer', function (data) {
    var outer = document.getElementById("message").getElementsByTagName("div")[0];

    showobj.innerHTML += "<li>" +
      "<div><em class='text-primary'>" + data.username + ":</em></div>" +
      "<div>" + data.message + "</div>" +
    "</li>";

    if (parseInt(showobj.offsetHeight) - parseInt(outer.offsetHeight) > 0) {
      outer.scrollTop = parseInt(showobj.offsetHeight) - parseInt(outer.offsetHeight);
    }

  });
}

dologin();