var webdriver = require("selenium-webdriver");

module.exports.checkIn = function (opt) {
  var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

  var getSouthwestDotCom = function () {
    console.log("Visiting southwest.com...");
    return driver.get("http://www.southwest.com");
  };

  var submitCheckInForm = function () {
    console.log("Submitting check in form...");
    var checkInPanel = driver.findElement(webdriver.By.id('check-in-panel'));
    var confNum = driver.findElement(webdriver.By.id('checkin_confnum'));
    var firstName = driver.findElement(webdriver.By.id('checkin_firstname'));
    var lastName = driver.findElement(webdriver.By.id('checkin_lastname'));
    checkInPanel.click();
    confNum.clear();
    confNum.sendKeys(opt.confirmationNumber);
    firstName.clear();
    firstName.sendKeys(opt.firstName);
    lastName.clear();
    lastName.sendKeys(opt.lastName);
    confNum.submit();
    return driver.sleep(5000);
  };

  var confirmCheckIn = function () {
    console.log("Confirming check in...");
    return driver.getPageSource().then(function (pageSource) {
      if (-1 != pageSource.indexOf("The request to check in and print your Boarding Pass is more than 24 hours prior to your scheduled departure")) {
        throw new Error("request not in checkin window");
      }
    }).
    then(function () {
      driver.findElement(webdriver.By.id('printDocumentsButton')).click();
      return driver.sleep(5000);
    });
  };

  var getBoardingPassUrl = function () {
    console.log("Getting boarding pass URL...");
    return driver.getCurrentUrl();
  };

  var promise = getSouthwestDotCom().
    then(submitCheckInForm).
    then(confirmCheckIn).
    then(getBoardingPassUrl);

  return promise;
}

