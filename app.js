var express = require('express');
var scheduleCheckIn = require('./schedule-check-in');
var airportsAutocomplete = require('./airports-autocomplete');
var emailService = require("./email-service");
var departureDateTime = require("./departure-date-time");
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
    departureDateTime: null,
    emailAddress: req.body.emailAddress
  };
  departureDateTime.getDepartureDateTime(req.body.departureDateTimeString, req.body.departureAirport, function (departureDateTime) {
    opt.departureDateTime = departureDateTime;
    scheduleCheckIn.scheduleCheckIn(opt);
    res.render('check-in', opt);
  });
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

app.configure('production', function () {
  app.listen(80);
  console.log('listening on port 80...');
});

app.configure('development', function () {
  app.listen(3000);
  console.log('listening on port 3000...');
})
