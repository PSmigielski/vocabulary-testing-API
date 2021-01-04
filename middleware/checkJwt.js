const jwt = require("express-jwt");
const checkJwt = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.token,
});

module.exports = checkJwt;
