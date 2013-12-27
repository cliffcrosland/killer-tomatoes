var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'cliffcrosland@gmail.com',
    pass: 'orziruamofeahblu'
  }
});

exports.sendEmail = function (emailAddress, htmlMessage) {
  var opt = {
    from: 'Cliffanie Airlines <cliffcrosland@gmail.com>',
    to: emailAddress,
    subject: 'Cliffanie Airlines - Update on your flight',
    html: htmlMessage
  };

  transport.sendMail(opt, function (err, res) {
    if (err) {
      console.error("!!!Error sending email!!!");
      console.error(err);
      return;
    }
    console.log("Email sent:");
    console.log(opt);
    console.log(res.message);
  });
};