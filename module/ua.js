module.exports = function (useragent) {
  var KE = {};
  return KE.browser = (function () {
    var ua = useragent.toLowerCase();

    return {
      VERSION:ua.match(/(msie|firefox|webkit|opera)[\/:\s](\d+)/) ? RegExp.$2 : "0",
      IE:(ua.indexOf("msie") > -1 && ua.indexOf("opera") == -1),
      GECKO:(ua.indexOf("gecko") > -1 && ua.indexOf("khtml") == -1),
      WEBKIT:(ua.indexOf("applewebkit") > -1),
      OPERA:(ua.indexOf("opera") > -1)
    };
  })();
};