'use strict';

const express = require('express');
const router = express.Router();
const authentication = require('../auth/middleware/basic');

router.post('/signin', authentication, async (request, response) => {
  try {
    response.status(200).send(request.body);
  } catch (err) {
    response.status(403).send('Error logging in');
  }
});

module.exports = router;