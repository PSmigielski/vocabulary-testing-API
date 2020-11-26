const examModel = require("../models/exam.model");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  } else {
    examModel.create(req.body.scope, (err, data) => {
      if (err) {
        res.status(500).send({ message: "something went wrong, try again" });
      } else {
        res.status(200).send(data);
      }
    });
  }
};
exports.saveResults = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  } else {
    if (req.body.maxPoints <= req.body.gainedPoints) {
      res.status(403).send({ message: "Data are wrong!" });
    } else {
      examModel.saveResults(
        {
          username: req.body.username,
          maxPoints: req.body.maxPoints,
          gainedPoints: req.body.gainedPoints,
        },
        (err, data) => {
          if (err) {
            res
              .status(500)
              .send({ message: "something went wrong, try again" });
          } else {
            res.status(201).send({ message: "added results to database" });
          }
        }
      );
    }
  }
};
