const router =  require('express').Router();
const wordController = require('../controllers/word.controller');

router.post('/create', wordController.create);
router.post('/upload', wordController.upload);
router.get('/show', wordController.show);
router.delete('/delete', wordController.delete);

module.exports = router;