const router =  require('express').Router();

router.get('/', (req, res)=>{
    res.send('hello there')
});


module.exports = router;