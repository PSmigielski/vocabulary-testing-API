const jwt_decode = require("jwt-decode");

const attachUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Authentication invalid" });
  }
  const decodedToken = jwt_decode(token);
  if (!decodedToken) {
    return res
      .status(401)
      .send({ message: "There was a problem authorizing the token" });
  } else {
    req.user = decodedToken;
    next();
  }
};
module.exports = attachUser;
