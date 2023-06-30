const nodemailer = require("nodemailer");
require("dotenv").config();

const USER_SENDER = process.env.USER_SENDER;
const USER_PASSWORD = process.env.USER_PASSWORD;

function sendEmail(receiver_email,link){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: USER_SENDER,
          pass: USER_PASSWORD
        },
        tls:{rejectUnauthorized:true}
      });
    
      const mailOptions = {
        from: USER_SENDER,
        to: receiver_email,
        subject: 'Confirmation email',
        text: `Click ${link}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {sendEmail}