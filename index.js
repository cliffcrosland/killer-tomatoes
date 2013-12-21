var webdriver = require("selenium-webdriver");

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

var confirmationNumber = 'ZW6X84';
var firstName = 'Clifton';
var lastName = 'Crosland';

var submitCheckInForm = function () {
  console.log("Submitting check in form...");
  var checkInPanel = driver.findElement(webdriver.By.id('check-in-panel'));
  var confnum = driver.findElement(webdriver.By.id('checkin_confnum'));
  var firstname = driver.findElement(webdriver.By.id('checkin_firstname'));
  var lastname = driver.findElement(webdriver.By.id('checkin_lastname'));
  checkInPanel.click();
  confnum.clear();
  confnum.sendKeys(confirmationNumber);
  firstname.clear();
  firstname.sendKeys(firstName);
  lastname.clear();
  lastname.sendKeys(lastName);
  confnum.submit();
  driver.sleep(5000);
};

var confirmCheckIn = function () {
  console.log("Confirming check in...");
  driver.findElement(webdriver.By.id('printDocumentsButton')).click();
  driver.sleep(5000);
};

var sendBoardingPassUrl = function () {
  console.log("Sending boarding pass URL...");
  driver.getCurrentUrl().then(function (url) {
    console.log("URL OF YOUR BOARDING DOCUMENT: ");
    console.log(url);
  })
};

console.log("Visiting southwest.com...");
driver.get("http://www.southwest.com").
  then(submitCheckInForm).
  then(confirmCheckIn).
  then(sendBoardingPassUrl).
  then(null, function (err) {
    console.log("An error occurred!");
    console.log(err);
  });

