var socket = io.connect('http://' + window.location.hostname + ':3000'); // socket

var tools = {},   // 工具方法载体
    cms = {},     // 业务逻辑载体
    api = {};     // api载体

api = {
  getalltag : "http://121.196.134.80/climtest/getAllTags.php?brand=coach",        // 获取标签接口
  getcommodity : "http://121.196.134.80/climtest/getGoodsofTags.php?brand=coach"  // 获取商品列表接口
};

/**
 * 方法说明:方便选取节点
 * @method selector
 * @for tools
 * @param {String} id ID名称,如"main".
 * @param {String} tag Tag名称+索引值,如"input0".
 * @return {object HTMLDocument} 返回需要的节点.
 */
tools.selector = function (id, tag) {
  if (tag) {
    var tagname,  // tag参数的input0的，input标签部分
        tagindex; // tag参数的input0的，input的索引部分
    /([a-z]+)(\d+)/.test(tag);
    tagname = RegExp.$1;
    tagindex = Number(RegExp.$2);

    return document.getElementById(id).getElementsByTagName(tagname)[tagindex];
  } else {
    return document.getElementById(id);
  }
};

/**
 * 方法说明:事件委托
 * @method live
 * @for tools
 * @param {object HTMLDocument} obj 添加委托的节点,如document.getElementById("...").
 * @param {String} tagname 触发的事件源,如"span".
 * @param {Function} callback 成功触发的回调函数,用来做后续操作.
 */
tools.live = function (obj, tagname, callback){
  if(!obj.length && !tagname.length)return;

  obj.onclick = function (ev) {
    var ev = window.event || ev;             // 事件兼容处理
    var target = ev.target || ev.srcElement; // 事件源

    if (target.tagName.toLowerCase() === tagname) {
      callback && callback(target);
    }
  };
};

/**
 * 方法说明:数组里查找自定项
 * @method inArray
 * @for tools
 * @param {String || Number} needle 需要查找的项.
 * @param {objert Array} array 需要查找的数组.
 * @param {Boolean} bool 为true则返回索引值.
 */
tools.inArray = function (needle, array, bool) {  
  if (typeof needle == "string" || typeof needle == "number") { 
    for(var i in array){ 
      if(needle === array[i]){ 
        if(bool){ 
          return i; 
        } 
        return true; 
      } 
    } 
    return false;  
  }  
};

/* 业务逻辑载体 */
cms = {
  taglayer : tools.selector("tag"),           // 标签div  
  selectlayer : tools.selector("selected"),   // 已筛选div  
  showul : tools.selector("show", "ul0"),     // 展示ul
  total : tools.selector("total"),
  tagarr : []                                 // 筛选Array,用来存放选择的标签。用途：转换成queryString变成接口参数。
};

/**
 * 方法说明:初始化及载入数据
 * @method init
 * @for cms
 */
cms.init = function(){
  var that = this;

  socket.emit(                    // 获取tag接口事件
    "getTag",                     // 接口名称
    { url : api.getalltag },      // 接口地址
    function (json) {             // 成功回调
      var taghtml = "";

      for (var i = 0; i < json.data.length; i++) {
        taghtml += "<a href='javascript:;' tag=" + encodeURI(json.data[i]) + " data-index='" + i + "'>" + json.data[i] + "</a>";
      }

      that.taglayer.innerHTML = taghtml;   // 插入tag
      that.showcommodity("%E5%A5%B3%E5%8C%85");  // 获取默认商品列表
    }
  );

  that.event(); // 载入事件委派
};

/**
 * 方法说明:根据条件载入商品
 * @method showcommodity
 * @for cms
 * @param {String} querystring 筛选的条件.
 */
cms.showcommodity = function (querystring) {
  var showstr = "", that = this;

  socket.emit(                                              // 获取商品列表事件
    'screeningTag',                                         // 接口名称
    { url : api.getcommodity + "&tags=" + querystring },    // 接口地址&参数
    function (json) {                                       // 成功回调
      total.innerHTML = json.data.length;

      for (var i = 0; i < json.data.length; i++) {
        showstr += '<li>' +
          '<div class="lhwrap">' +
            '<div class="lhimg">' +
              '<img src="' + json.data[i].pic + '" width="100" height="100">' +
            '</div>' +
            '<div class="lhid">ID:<span class="red">' + json.data[i].id + '</span></div>' +
            '<div class="lhname">商品名称:<span class="red">' + json.data[i].name + '</span></div>' +
            '<div class="lhbrand">类型:<span class="red">' + json.data[i].brand + '</span></div>' +
          '</div>' +
        '</li>';
      };
      
      that.showul.innerHTML = showstr;  // 插入商品
    }
  );
};

/* 标签选择和删除筛选事件委派 */
cms.event = function(){
  var that = this;

  tools.live(that.selectlayer, "span", function (target) { // 移除筛选
    var removetag = target.getAttribute('_tagname');
    var alltag = that.taglayer.getElementsByTagName("a");
    var arrindex = null;

    that.selectlayer.removeChild(target.parentNode);  // 删除筛选
    alltag[target.getAttribute("_i")].style.display = "inline"; // 删除筛选后显示对应的标签

    arrindex = tools.inArray(removetag, that.tagarr, true);

    if (arrindex) {
      var tag = "";

      that.tagarr.splice(arrindex,1); // 删除数组中项

      if (that.tagarr.length) {
        tag = that.tagarr.join(",");
        that.showcommodity(tag);  // 根据数组重新载入商品
      } else {
        tag = "%E5%A5%B3%E5%8C%85";
        that.showcommodity(tag);  // 初始化载入商品
      }
    }
  });

  tools.live(that.taglayer, "a", function (target) { // 创建筛选
    var showstr = "";

    if  (!tools.inArray(target.getAttribute('tag'), that.tagarr, false)) {
      that.tagarr.push(target.getAttribute('tag'));
      target.style.display = "none";
      that.addscreening(target.getAttribute('tag'), target.getAttribute("data-index"));
    }

    that.showcommodity(that.tagarr.join(","));
  });
};

cms.addscreening = function (tagname, index) { // 创建筛选并插入指定位置
  var that = this;
  var screeningstr = '<div class="t">' + decodeURI(tagname) + '<span class="c" _i=' + index + ' _tagname="' + tagname + '">X</span></div>';

  that.selectlayer.innerHTML += screeningstr;
};

cms.init();