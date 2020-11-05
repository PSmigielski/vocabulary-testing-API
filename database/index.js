const mysql = require('mysql');

const db = mysql.createConnection({
  host     : proccess.env.HOST,
  user     : proccess.env.USER,
  password : proccess.env.PASSWORD,
  database : proccess.env.DB
});

db.connect(function(err) {
  if (err) {
    throw err;
  }  
  console.log('DATABASE CONNECTED');
});

module.exports = db;