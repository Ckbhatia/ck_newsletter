const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function triggerMail(
  credEmail,
  credPass,
  service,
  from,
  to,
  bcc,
  subject,
  html
) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service,
    auth: {
      user: credEmail,
      pass: credPass
      //   user: "luminus420@gmail.com", // generated ethereal user
      //   pass: "New$world420Luminus" // generated ethereal password
    }
  });

  const mailOptions = {
    // from: "luminus420@gmail.com", // sender address
    // to: "chetansain86@gmail.com", // list of receivers
    // subject: "Learn about this new technology", // Subject line
    // html: template("Chetan", "hglsghslghsl") // plain text
    from, // sender address
    // to, // list of receivers
    bcc,
    subject, // Subject line
    html // plain text body
  };

  // send mail with defined transport object
  await transporter.sendMail(mailOptions);
}

module.exports = triggerMail;
