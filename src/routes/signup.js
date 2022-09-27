'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('../auth/models');

router.post('/signup', async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 5);
    const record = await Users.create(req.body);
    res.status(200).send(record);
  } catch (err) {
    console.log(err);
    res.status(403).send('Error Creating User');
  }
});

module.exports = router;