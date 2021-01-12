const router = require("express").Router();
const userController = require("../controllers/user.controller");
const attachUser = require("../middleware/attachUser");
const checkRefreshToken = require("../middleware/checkRefreshToken");

router.post("/login", userController.login);
router.post("/register", userController.create);
router.post("/reset-password", userController.genResetPasswordToken);
router.put("/reset-password/:token", userController.resetPassword);
router.delete("/delete", userController.delete);
router.put("/verify/:login", userController.verify);
router.delete("/logout", attachUser, userController.logout);
router.post("/refresh", checkRefreshToken, userController.refreshToken);
//TODO add refreshing token method
module.exports = router;
