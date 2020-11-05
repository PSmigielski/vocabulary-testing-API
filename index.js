const express = require('express');
const Routes = require('./routes/index');
require('dotenv').config();

const app = express();
app.use(express.json());


app.use('/v1/api/words', Routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));