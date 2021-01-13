const router = require("express").Router();
const examController = require("../controllers/exam.controller");
const csrfProtection = require("../middleware/csrfProtection");

router.post("/create", csrfProtection, examController.create);
router.post("/save", csrfProtection, examController.saveResults);

module.exports = router;
