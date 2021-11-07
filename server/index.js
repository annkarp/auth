const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');

require('dotenv').config();
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());

app.listen(PORT,() => {
  console.log(`app listening in port ${PORT}`)
})

app.use('/auth', authRoute);

app.use('*', (req, res) => {
  res.status(404).send('route not found');
})
