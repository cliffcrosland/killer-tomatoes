var express = require('express');
var scheduleCheckIn = require('./schedule-check-in');
var app = express();
var ac = require('autocomplete');
var fs = require('fs');
var EOL = require('os').EOL;

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//app.use(errorHandler);

app.post('/check_ins', function (req, res) {
  var opt = {
    confirmationNumber: req.body.confirmationNumber,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    departureDateTime: new Date(req.body.departureDateTime),
    emailAddress: req.body.emailAddress
  };
  scheduleCheckIn.scheduleCheckIn(opt);
  res.json(opt);
});

app.get('/check_ins', function (req, res) {
  res.json(scheduleCheckIn.getScheduledCheckIns());
});

app.get('/', function (req, res) {
  res.render('form');
});

var autocomplete = ac.connectAutocomplete();
initializeAutocomplete(autocomplete);

app.get('/airports', function (req, res) {
  var results = autocomplete.search(req.query['term'].toLowerCase());
  res.send(results);
});

function errorHandler(err, req, res, next) {
  console.error("An error occurred:");
  console.error(err.stack);
  res.status(500);
  var errorMsg = err;
  if (err && err.stack) {
    errorMsg = err.stack.split("\n").join("<br />");
  }
  res.render('error', { error: errorMsg });
}

function initializeAutocomplete(autocomplete) {
  fs.readFile('./airports.dat', function (err, data) {
    var airports = data.toString().split(EOL);
    autocomplete.initialize(function (onReady) {
      onReady(airports);
    });
  });
}

app.listen(3000);
