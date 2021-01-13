const router = require("express").Router();
const wordController = require("../controllers/word.controller");
const checkJwt = require("../middleware/checkJwt");
const csrfProtection = require("../middleware/csrfProtection");

router.post("/create", csrfProtection, checkJwt, wordController.create);
router.post("/upload", csrfProtection, checkJwt, wordController.upload);
router.get("/show", csrfProtection, checkJwt, wordController.show);
router.delete("/delete", csrfProtection, checkJwt, wordController.delete);

module.exports = router;
