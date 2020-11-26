const router = require("express").Router();
const examController = require("../controllers/exam.controller");

router.post("/create", examController.create);
router.post("/save", examController.saveResults);

module.exports = router;
