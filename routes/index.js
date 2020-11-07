const router =  require('express').Router();
const wordController = require('../controllers/word.controller');
const { word } = require('../models/word.model');

router.post('/create', wordController.create);
router.post('/upload', wordController.upload);
router.get('/show', wordController.show);

module.exports = router;