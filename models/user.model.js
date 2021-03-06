const sql = require("../database/index");
const CryptoJS = require("crypto-js");
const resetMail = require("../mailer/resetMail.js");
const verifyMail = require("../mailer/verifyMail.js");
const jwt = require("jsonwebtoken");

const createToken = (username, secret) => {
  return jwt.sign({ username }, secret);
};
const User = function (user) {
  this.id = null;
  this.email = user.email;
  this.username = user.username;
  this.password = CryptoJS.SHA3(user.password).toString(CryptoJS.enc.Hex);
};
User.genResetPasswordToken = (email, result) => {
  function genHexString(len) {
    const hex = "0123456789abcdef";
    let output = "";
    for (let i = 0; i < len; ++i) {
      output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
  }
  const token = genHexString(20);
  sql.query(
    `INSERT INTO \`reset_password\` (id, email, token) VALUES (0, ?, ?)`,
    [email, token],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, { message: "success" });
    }
  );
  resetMail(email, token);
};
User.resetPassword = (resetUser, result) => {
  sql.query(
    "SELECT * FROM `reset_password` WHERE token=?",
    resetUser.token,
    (err1, res1) => {
      if (err1) {
        console.log(err1);
        result(err1, null);
        return;
      }
      if (res1.length == 0) {
        console.log(err1);
        result({ kind: "404" }, null);
        return;
      } else if (res1.length > 1) {
        console.log(err1);
        result({ kind: "conflict" }, null);
        return;
      } else {
        sql.query(
          `UPDATE users SET password = ? WHERE email = ?`,
          [resetUser.password, resetUser.email],
          (err2, res2) => {
            if (err2) {
              console.log(err2);
              result(err2, null);
              return;
            } else {
              sql.query(
                `DELETE FROM \`reset_password\` WHERE email = ?`,
                resetUser.email,
                (err3, res3) => {
                  if (err3) {
                    console.log(err3);
                    result(err3, null);
                    return;
                  }
                  result(null, { message: "password has been updated" });
                }
              );
            }
          }
        );
      }
    }
  );
};
User.create = (newUser, result) => {
  console.log(newUser);
  sql.query(
    `SELECT * FROM users WHERE email = ?`,
    newUser.email,
    (err1, res1) => {
      if (err1) {
        console.log("error: ", err1);
        result(err1, null);
        return;
      }
      if (res1.length > 0) {
        result({ kind: "conflict", type: "email" }, null);
        return;
      } else {
        sql.query(
          `SELECT * FROM users WHERE username = '${newUser.username}'`,
          (err2, res2) => {
            if (err2) {
              console.log("error", err2);
              result(err2, null);
              return;
            }
            if (res2.length > 0) {
              result({ kind: "conflict", type: "username" }, null);
              return;
            } else {
              sql.query(
                `INSERT INTO users (id, email, username, password, verified) VALUES ('0',? , ?, ?, '0')`,
                [newUser.email, newUser.username, newUser.password],
                (err3, res3) => {
                  if (err3) {
                    console.log("error: ", err3);
                    result(err3, null);
                    return;
                  }
                  console.log(newUser.User);
                  verifyMail(newUser.email, newUser.username);
                  console.log("created user: ", {
                    id: res3.insertId,
                    ...newUser,
                  });
                  result(null, { id: res3.insertId, ...newUser });
                }
              );
            }
          }
        );
      }
    }
  );
};
User.login = (credentials, result) => {
  sql.query(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [credentials.email, credentials.password],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.length == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      if (res[0].verified == 0) {
        result(null, res[0].verified);
      } else {
        const refresh_token = createToken(
          res[0].username,
          process.env.REFRESH_TOKEN_SECRET
        );
        sql.query(
          `SELECT * FROM \`refresh_tokens\` where \`refresh_token\`='${refresh_token}'`,
          (err1, res1) => {
            if (err1) {
              console.log("error:", err1);
              result(null, err1);
              return;
            }
            if (res1.length > 0) {
              result({ kind: "already_logged_in" }, null);
              return;
            } else {
              sql.query(
                `INSERT INTO \`refresh_tokens\` (\`refresh_token\`,\`username\`) VALUES ('${refresh_token}','${res[0].username}')`,
                (err2, res2) => {
                  if (err2) {
                    console.log("error:", err2);
                    result(null, err2);
                    return;
                  } else {
                    result(null, {
                      userData:{
                        id:res[0].id,
                        username:res[0].username,
                        email:res[0].email
                      },
                      refresh_token
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};
User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted users with id: ", id);
    result(null, res);
  });
};
User.verify = (username, result) => {
  sql.query(
    `UPDATE users SET verified = '1' WHERE username = '${username}'`,
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("verified users with username: ", username);
      result(null, res);
    }
  );
};
User.logout = (username, result) => {
  sql.query(
    `DELETE FROM \`refresh_tokens\` WHERE username=?`,
    [username],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length == 0) {
        result({ kind: "no_logged_user" }, null);
      } else {
        result(null, { message: "successfully logged out" });
      }
    }
  );
};
User.refresh_token = (token, result) => {
  sql.query(`SELECT * FROM \`refresh_tokens\` INNER JOIN \`users\` USING(\`username\`) WHERE \`refresh_tokens\`.\`refresh_token\`='${token}'`,
  (err, res) => {
    if (err) {
      console.log("error:", err);
      result(null, err);
      return;
    }
    if (res.length == 0) {
      result({ kind: "forbidden" }, null);
      return;
    }
    else{
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (error, user) =>{
        if(error) result({ kind: "forbidden" }, null);
        else{
          result(null, {
            id:res[0].id,
            username:res[0].username,
            email:res[0].email
          })
        }
      })
    }
  })
}
User.checkResetPasswordToken = (token, result) => {
  sql.query(`SELECT \`token\` FROM \`reset_password\` WHERE \`token\` = '${token}'`, (err, res)=>{
    if(err){
      console.log("error: ", err);
      result(err, null)
      return
    }
    if(res.length == 0){
      result({kind:'not_found'}, null);
      return;
    }
    else{
      result(null, {message: 'token is valid'});
    } 
  })
}
module.exports = User;
