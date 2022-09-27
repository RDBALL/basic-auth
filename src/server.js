'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const signin = require('./routes/signin');
const signup = require('./routes/signup');

const notFound = require('./middleware/404');
const serverError = require('./middleware/500');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('👍 Server is running for RDBALL Code 401d48 Lab06.');
});
app.use(signin);
app.use(signup);
app.get('*', notFound);
app.use(serverError);

module.exports = {
  start: (port) => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
  },
  app,
};