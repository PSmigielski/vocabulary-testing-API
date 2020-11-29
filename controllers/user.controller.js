const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const createToken = (username, secret) => {
  return jwt.sign({ username }, secret, {
    expiresIn: 18000,
  });
};
exports.genResetPasswordToken = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  User.genResetPasswordToken(req.body.email, (err, data) => {
    if (err) {
      res.status(500).send({ message: "something went wrong" });
    } else {
      res.status(201).send(data);
    }
  });
};
exports.resetPassword = (req, res) => {
  if (!req.params.token) {
    res.status(400).send({
      message: "Token not found",
    });
  }
  const user = {
    token: req.params.token,
    email: req.body.email,
    password: CryptoJS.SHA3(req.body.password).toString(CryptoJS.enc.Hex),
  };
  User.resetPassword(user, (err, data) => {
    if (err) {
      if (err.kind == "404") {
        res.status(404).send({
          message: err.message || "user not found",
        });
      }
      if (err.kind == "conflict") {
        res.status(409).send({
          message: err.message || "something went wrong",
        });
      } else {
        res.status(500).send({
          message: err.message || "server error",
        });
      }
    } else {
      res.status(201).send(data);
    }
  });
};
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    id: null,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.create(user, (err, data) => {
    if (err) {
      if ((err.kind = "conflict")) {
        switch (err.type) {
          case "email":
            res.status(409).send({
              message: err.message || "Account with that email just exist.",
            });
            break;
          case "username":
            res.status(409).send({
              message: err.message || "Account with that username just exist.",
            });
            break;
        }
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      }
    } else {
      res.status(201).send(data);
    }
  });
};
exports.login = (req, res) => {
  const credentials = {
    email: req.body.email,
    password: CryptoJS.SHA3(req.body.password).toString(CryptoJS.enc.Hex),
  };
  User.login(credentials, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `credentials don't match`,
        });
      }
    } else {
      const token = createToken(credentials.username, process.env.SECRET);
      res.status(200).send({ token, verified: data });
    }
  });
};
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.id,
        });
      }
    } else res.status(200).send({ message: `User was deleted successfully!` });
  });
};
exports.verify = (req, res) => {
  User.verify(req.params.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.username}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not verify User with username " + req.params.username,
        });
      }
    } else res.status(200).send({ message: `User was verified successfully!` });
  });
};
