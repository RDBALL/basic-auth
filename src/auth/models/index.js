'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./user-models');
const DatabaseInterface = require('./DatabaseInterface');

const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory': process.env.DATABASE_URL;

const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const UsersModel = userSchema(sequelizeDatabase, DataTypes);

module.exports = {
  sequelizeDatabase,
  Users: new DatabaseInterface(UsersModel),
};