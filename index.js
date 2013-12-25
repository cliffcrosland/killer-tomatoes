var checkIn = require("./check-in");

checkIn.checkIn({
  confirmationNumber: 'ZW6X84',
  firstName: 'Clifton',
  lastName: 'Crosland'
}).then(success, error);

function success(boardingPassUrl) {
  console.log("Your boarding pass url is:");
  console.log(boardingPassUrl);
}

function error(err) {
  console.error("An error occurred.");
  console.error(err);
}