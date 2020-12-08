const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_LOGIN,
    pass: process.env.MAIL_PASSWORD,
  },
});
module.exports = transporter;
