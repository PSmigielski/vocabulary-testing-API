const transporter = require("./transporter");

const resetMail = async (mail, token) => {
  let info = await transporter.sendMail({
    from: "platforma zsł",
    to: mail,
    subject: `Zresetuj hasło`,
    text: `http://localhost:3000/reset/${token}`,
  });
};
module.exports = resetMail;
