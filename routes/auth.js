const router = require("express").Router();
const userController = require("../controllers/user.controller");
const attachUser = require("../middleware/attachUser");
const checkRefreshToken = require("../middleware/checkRefreshToken");
const csrfProtection = require("../middleware/csrfProtection");

router.post("/login", csrfProtection, userController.login);
router.post("/register", csrfProtection, userController.create);
router.post("/reset-password", csrfProtection, userController.genResetPasswordToken);
router.post("/refresh", csrfProtection, checkRefreshToken, userController.refreshToken);
router.put("/reset-password/:token", csrfProtection, userController.resetPassword);
router.put("/verify/:login", csrfProtection , userController.verify);
router.delete("/delete", csrfProtection, userController.delete);
router.delete("/logout", csrfProtection, attachUser, userController.logout);
router.get("/reset-password/:token", userController.checkResetPasswordToken);
router.get('/csrf-token', csrfProtection, (req, res)=>{
    res.send({ csrfToken: req.csrfToken() });
})
module.exports = router;
