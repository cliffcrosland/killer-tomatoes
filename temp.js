var fs = require('fs');
var EOL = require('os').EOL;

fs.readFile('./temp.txt', function (err, data) {
  var lines = data.toString().split(EOL);

  var airports = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/[A-Z][A-Z][A-Z]/)) {
      console.log("option " + line);
    }
  }
});