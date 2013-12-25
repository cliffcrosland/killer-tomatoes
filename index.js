var express = require('express');
var scheduleCheckIn = require('./schedule-check-in');
var app = express();

app.get('/', function (req, res) {
  var opt = {
    confirmationNumber: 'ZW6X84',
    firstName: 'Clifton',
    lastName: 'Crosland',
    departureDateTime: new Date('Thu Dec 26 2013 10:10:00 GMT-0800 (Pacific Standard Time)'),
    emailAddress: 'cliffcrosland@gmail.com',
    cellPhoneNumber: '650-799-3336'
  };
  scheduleCheckIn.scheduleCheckIn(opt);
  res.json(opt);
});

app.listen(3000);

