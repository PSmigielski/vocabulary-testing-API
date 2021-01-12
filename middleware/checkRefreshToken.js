const jwt = require("express-jwt");
const checkRefreshToken = jwt({
    secret:process.env.REFRESH_TOKEN_SECRET,
    algorithms: ["HS256"],
    getToken: (req) => req.cookies.refresh_token
}) 

module.exports = checkRefreshToken;
