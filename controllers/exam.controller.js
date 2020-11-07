const examModel = require('../models/exam.model');


exports.create = (req, res) =>{
    if(!req.body){
        res.status(400).send({message:'Content can not be empty!'});
    }else{
        examModel.create(req.body.scope, (err, data) => {
            if(err){
                res.status(500).send({message:'something went wrong, try again'});
            }
            else{
                res.status(200).send(data)
            }
        })
    }
}