const router =  require('express').Router();
const wordController = require('../controllers/word.controller');

router.post('/create', wordController.create);
router.post('/upload', wordController.upload);

module.exports = router;