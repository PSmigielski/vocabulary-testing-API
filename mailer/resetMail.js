const transporter = require('./transporter');

const resetMail = async(mail, token) => {
  let info = await transporter.sendMail({
    from: 'platforma zsł',
    to: mail,
    subject: `Zresetuj hasło`,
    text: `http://localhost:5000/reset-password/${token}` ,
  });
}
module.exports = resetMail;