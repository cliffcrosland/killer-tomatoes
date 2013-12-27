var fs = require('fs');
var EOL = require('os').EOL;

var airports = [];
fs.readFile('./airports-autocomplete/airports.txt', 'utf8', function (err, data) {
  airports = data.toString().split(EOL);
});

function search(term) {
  var results = [];
  for (var i = 0; i < airports.length; i++) {
    var airport = airports[i];
    if (airport.indexOf(term) != -1) {
      results.push(airport);
    }
  }
  return results;
}

exports.airports = function (req, res) {
  var results = search(req.query['term']);
  res.send(results);
};

