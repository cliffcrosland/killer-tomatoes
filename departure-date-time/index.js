var request = require('request');
var async = require('async');
var time = require('time');

exports.getDepartureDateTime = function (departureDateTimeString, departureAirport, callback) {
  var getTimezone = async.compose(getTimezoneFromLatLng, getLatLng);
  getTimezone({
    departureDateTimeString: departureDateTimeString,
    departureAirport: departureAirport
  }, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }
    var departureDateTime = new time.Date(departureDateTimeString);
    departureDateTime.setTimezone(result.timeZoneId);
    callback(departureDateTime);
  });
};

function getLatLng(opt, callback) {
  var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + encodeURI(opt.departureAirport);
  request(geocodeUrl, function (err, result, body) {
    if (err || result.statusCode != 200) {
      console.error(err);
      return callback(err);
    }
    var results = JSON.parse(body).results;
    opt.latLng = results[0].geometry.location;
    callback(null, opt);
  });
};

function getTimezoneFromLatLng(opt, callback) {
  var location = opt.latLng.lat + "," + opt.latLng.lng;
  var timestamp = Math.round(new Date(opt.departureDateTimeString).getTime() / 1000);
  var timezoneUrl = 'https://maps.googleapis.com/maps/api/timezone/json?sensor=false&location=' + encodeURI(location) + '&timestamp=' + encodeURI(timestamp);
  request(timezoneUrl, function (err, result, body) {
    if (err || result.statusCode != 200) {
      console.error(err);
      return callback(err);
    }
    var results = JSON.parse(body);
    callback(null, results);
  });
}
