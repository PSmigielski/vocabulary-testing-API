const wordModel = require('../models/word.model');

exports.create = (req, res) => {
    if (!req.query) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    } else {
      const word = {
        word: req.query.word,
        definition: req.query.definition,
        section_id: req.query.sectionID
      }
      wordModel.create(word, (err, data) => {
        if(err){
          if(err.kind == "conflict"){
            res.status(409).send({message: 'this word already exist'});
          }
          else{
            res.status(500).send({message: 'something went wrong, try later'});
          }
        } else{
          res.status(201).send(data);
        }
      });
    }
}
exports.upload = (req, res) => {
  if(!req.body){
    res.status(400).send({message: 'Content can not be empty!'});
  }else{
    wordModel.upload(req, (err, data) => {
      if(err){
        if(err.type == 'invalid') res.status(403).send({message: 'file is invalid'});
        else res.status(500).send({message: 'something went wrong, try later'});
      }else res.status(201).send(data);
    })
  }
}
exports.show = (req, res) => {
  if(!req.query){
    res.status(400).send({message: 'Content can not be empty!'});
  }else{
    wordModel.show(req.query.sectionID, (err, data) => {
      if(err){
        if(err.type == '404') res.status(404).send({message:'this section don\'t exist'})
        else res.status(500).send({message: 'something went wrong, try later'})
      }
      else res.status(200).send({data: data});
    })
  }
}
exports.delete = (req, res) =>{
  if(!req.query){
    res.status(400).send({message: 'Content can not be empty!'});
  }
  else{
    wordModel.delete(req.query.sectionID, (err, data) => {
      if(err){
        if(err.type == '404') res.status(404).send({message:'this section don\'t exist'})
        else res.status(500).send({message: 'something went wrong, try later'})
      }
      else res.status(200).send({data: data});
    })
  }
}