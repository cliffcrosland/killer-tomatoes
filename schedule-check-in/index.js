var checkIn = require("../check-in");
var emailService = require("../email-service");
var cronJob = require('cron').CronJob;
var _ = require('underscore');

var pendingJobs = [];

module.exports.pendingCheckInJobs = pendingJobs;

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

    console.log("Sent email:");
    console.log(params.emailAddress);
    console.log(msg);
  };

  var error = function (err) {
    var msg = "<p>An error occurred while trying to check you in: </p>" + err;
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

  var checkInDateTime = new Date(params.departureDateTime.getTime() - 24 * 60 * 60 * 1000);

  var job = new cronJob({
    cronTime: checkInDateTime,
    start: true,
    onTick: function () {
      checkInJob();
      this.stop();
    }
  });

  pendingJobs.push(job);
};


function getMissingParams(params) {
  var required = ['confirmationNumber', 'firstName', 'lastName', 'departureDateTime', 'emailAddress', 'cellPhoneNumber'];
  return _.difference(required, _.keys(params));
}
