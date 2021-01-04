const router = require("express").Router();
const wordController = require("../controllers/word.controller");
const checkJwt = require("../middleware/checkJwt");

router.post("/create", checkJwt, wordController.create);
router.post("/upload", checkJwt, wordController.upload);
router.get("/show", checkJwt, wordController.show);
router.delete("/delete", checkJwt, wordController.delete);

module.exports = router;
