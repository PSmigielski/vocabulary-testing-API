const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");

const createToken = ({username, id, email}, secret) => {
  return jwt.sign({ username, id, email }, secret, {
    expiresIn: "15m",
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
    return res.status(400).send({
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
        return res.status(404).send(err.message || "user not found");
      }
      if (err.kind == "conflict") {
        return res.status(409).send(err.message || "something went wrong");
      } else {
        return res.status(500).send(err.message || "server error");
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
        return res.status(401).send({
          message: `credentials don't match`,
        });
      }
      if (err.kind === "already_logged_in") {
        return res.status(500).send({
          message: `user has logged in already`,
        });
      }
    } else {
      const JWTtoken = createToken(
        data.userData,
        process.env.JWT_SECRET
      );
      const exp = jwtDecode(JWTtoken).exp;
      res
        .status(200)
        .cookie("token", JWTtoken, { httpOnly: true })
        .cookie("refresh_token", data.refresh_token, { httpOnly: true })
        .json({
          userInfo: data.userData,
          expiresAt: exp,
        });
    }
  });
};
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found Customer with id ${req.params.id}.`,
        });
      } else {
        return res.status(500).send({
          message: "Could not delete User with id " + req.id,
        });
      }
    } else res.status(200).send({ message: `User was deleted successfully!` });
  });
};
exports.verify = (req, res) => {
  User.verify(req.params.login, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.login}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not verify User with username " + req.params.login,
        });
      }
    } else res.status(200).send({ message: `User was verified successfully!` });
  });
};
exports.logout = (req, res) => {
  User.logout(req.user.username, (err, data) => {
    if (err) {
      if ((err.kind = "no_logged_user")) {
        return res
          .status(404)
          .send({ message: "nobody logged in with this username" });
      } else {
        return res.status(500).send({ message: "server error" });
      }
    } else {
      res
        .status(200)
        .clearCookie("token", { httpOnly: true })
        .clearCookie("refresh_token", { httpOnly: true })
        .send({ message: "logged out" });
    }
  });
};
exports.refreshToken = (req, res) =>{
  const token = req.cookies.refresh_token;
  if(token){
    User.refresh_token(token, (err, data)=>{
      if(err){
        if(err.kind === "forbidden"){
          return res.status(403);
        }else{
          return res.status(500);
        }
      }
      else{
        const JWTtoken = createToken(data, process.env.JWT_SECRET);
        const exp = jwtDecode(JWTtoken).exp;
        res
          .status(200)
          .cookie("token", JWTtoken, { httpOnly: true })
          .send({expiresAt: exp});
      }
    });
  }else{
    return res.status(401)
  }
}
