var checkIn = require("../check-in");
var emailService = require("../email-service");
var cronJob = require('cron').CronJob;
var time = require('time');
var _ = require('underscore');

var pendingJobs = [];

exports.getScheduledCheckIns = function () {
  return pendingJobs.slice();
};

module.exports.scheduleCheckIn = function (params) {
  var missingParams = getMissingParams(params);
  if (missingParams.length > 0) {
    console.error("Error scheduleCheckIn() - Missing params: ");
    console.error(missingParams);
    return;
  }

  var success = function (boardingPassUrl) {
    var msg = "<p>You're checked in! Your boarding pass url is:<p>" +
      "<p><a href='" + boardingPassUrl + "'>" + boardingPassUrl + "</a></p>";
    emailService.sendEmail(params.emailAddress, msg);
  };

  var error = function (err) {
    var msg = "<p>An error occurred while trying to check you in: </p>" + 
      "<p>" + err + "</p>" +
      "<p>To check in on your own, visit <a href='http://www.southwest.com'>southwest.com</a></p>" +
      "<p>Confirmation #: " + params.confirmationNumber + "</p>" +
      "<p>First Name: " + params.firstName + "</p>" +
      "<p>Last Name: " + params.lastName + "</p>" + 
      "<p>Good luck!</p>";
    emailService.sendEmail(params.emailAddress, msg);
    console.error("An error occurred:");
    console.error(err);
  };

  var checkInJob = function () {
    checkIn.checkIn({
      confirmationNumber: params.confirmationNumber,
      firstName: params.firstName,
      lastName: params.lastName
    }).then(success, error);
  };

  var checkInDateTime = new time.Date(params.departureDateTime.getTime() - 24 * 60 * 60 * 1000);
  checkInDateTime.setTimezone(params.departureDateTime.getTimezone());

  console.log(checkInDateTime.toString());
  console.log(params.departureDateTime.toString());

  var job = new cronJob({
    cronTime: checkInDateTime,
    start: true,
    timeZone: params.departureDateTime.getTimezone(),
    onTick: function () {
      checkInJob();
      this.stop();
      pendingJobs = _.without(pendingJobs, params);
    }
  });

  job.start();
  pendingJobs.push(params);
};


function getMissingParams(params) {
  var required = ['confirmationNumber', 'firstName', 'lastName', 'departureDateTime', 'emailAddress'];
  return _.difference(required, _.keys(params));
}
