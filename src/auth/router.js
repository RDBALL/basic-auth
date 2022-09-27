'use strict';

const express = require('express');
const UsersModel = require('./models/index');
const basicAuth = require('./middleware/basic');
const bcrypt = require('bcrypt');


const router = express.Router();

router.post('/signup', basicAuth, async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);
    let newUser = await UsersModel.create({
      username,
      password: encryptedPassword,
    });
    res.status(200).send(newUser);
  } catch (err) {
    res.status(404).send('Cannot perform this method');
  }
});

router.post('/signin/', basicAuth, async (req, res, next) => {

});

module.exports = router;
