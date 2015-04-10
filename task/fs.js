var fs = require('fs');

fs.readFile('../txt/1.txt', 'utf8', function (err, data) {
  if (!err) {
    cnsole.log(data);
  } else {
    throw err;
  }
});