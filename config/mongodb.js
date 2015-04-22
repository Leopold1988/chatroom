module.exports = function (data, type) {
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/abc');

  var db = mongoose.connection;

  db.on('error', console.error);
  db.once('open', function() {
    if (type === "message") {
      var movieSchema = new mongoose.Schema({
        from: String
      , to: String
      , content: String
      , type: String
      , time: Date
      });

      var Movie = mongoose.model('Movie', movieSchema);
      var thor = new Movie(data);

      thor.save(function(err, thor) {
        if (err) return console.error(err);
        console.dir(thor);
      });
    }

    if (type === "user") {

    }
    // Create your schemas and models here.
    console.log("open success");
  });


};