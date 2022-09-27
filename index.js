'use strict';

const { sequelizeDatabase } = require('./src/auth/models');
const { start } = require('./src/server');
require('dotenv').config();
const PORT = process.env.PORT || 3001;

sequelizeDatabase.sync()
  .then(() => start(PORT))
  .catch((err) => console.log(err));