require("dotenv").config();
const cors = require("cors");
const db = require("./database/index");
const express = require("express");
const word = require("./routes/word");
const exam = require("./routes/exam");
const auth = require("./routes/auth");
const jwt = require("express-jwt");

const app = express();
app.use(cors());
app.use(jwt({ secret: process.env.SECRET, algorithms: ["HS256"] }));
app.use(express.json());
app.use("/v1/api/words", word);
app.use("/v1/api/exam", exam);
app.use("/v1/api/user", auth);

const port = process.env.PORT || 3000;
db.connect(function (err) {
  if (err) throw err;
  console.log("DATABASE CONNECTED");
});
app.listen(port, () => console.log(`Server started on port ${port}`));
