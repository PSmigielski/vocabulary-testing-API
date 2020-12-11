const transporter = require("./transporter");

const verifyMail = async (mail, login) => {
  let info = await transporter
    .sendMail({
      from: "vocabulary testing platform",
      to: mail,
      subject: `Weryfikacja`,
      text: `http://localhost:3000/verify/${login}`,
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = verifyMail;
