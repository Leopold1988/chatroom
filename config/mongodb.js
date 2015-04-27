// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/abc');
exports.mongoose = mongoose;