var express = require('express');
var scheduleCheckIn = require('./schedule-check-in');
var airportsAutocomplete = require('./airports-autocomplete');
var app = express();

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

app.get('/airports', airportsAutocomplete.airports);

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

app.listen(3000);
