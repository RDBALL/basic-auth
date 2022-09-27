'use strict';

const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Users } = require('../models');

const authentication = async (request, response, next) => {


  let basicHeaderParts = request.headers.authorization.split(' ');
  let encodedString = basicHeaderParts.pop();
  let decodedString = base64.decode(encodedString);
  let [username, password] = decodedString.split(':');

  try {
    const user = await Users.read(username);
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      request.body = user;
      next();
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) {
    console.log(error);
    response.status(403).send('Invalid Login');
  }
};

module.exports = authentication;