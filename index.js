var webdriver = require("selenium-webdriver");

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

var confirmationNumber = 'ZW6X84';
var firstName = 'Clifton';
var lastName = 'Crosland';

var submitCheckInForm = function () {
  driver.findElement(webdriver.By.id('check-in-panel')).click();
  driver.findElement(webdriver.By.id('checkin_confnum')).sendKeys(confirmationNumber);
  driver.findElement(webdriver.By.id('checkin_firstname')).sendKeys(firstName);
  driver.findElement(webdriver.By.id('checkin_lastname')).sendKeys(lastName);
  driver.findElement(webdriver.By.id('checkin_confnum')).submit();
  driver.sleep(5000);
};

var confirmCheckIn = function () {
  driver.findElement(webdriver.By.id('printDocumentsButton')).click();
  driver.sleep(5000);
};

var sendPrintBoardingPassUrl = function () {
  driver.getCurrentUrl().then(function (url) {
    console.log("URL OF YOUR BOARDING DOCUMENT: ");
    console.log(url);
  })
};

driver.get("http://www.southwest.com").
  then(submitCheckInForm).
  then(confirmCheckIn).
  then(sendPrintBoardingPassUrl).
  then(null, function (err) {
    console.log("An error occurred!");
    console.log(err);
  });

