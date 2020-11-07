require('dotenv').config();
const db = require('./database/index')
const express = require('express');
const Routes = require('./routes/index');

const app = express();
app.use(express.json());
app.use('/v1/api/words', Routes);

const port = process.env.PORT || 3000;
db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED');
});
app.listen(port, () => console.log(`Server started on port ${port}`));