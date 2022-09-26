'use strict';
//3rd party requirements
const express = require('express');
const bcrypt = require('bcrypt');
const base64 = require('base-64');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3002;

// we'll use this for inclass-demo.  one big monolithic file
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory' // two colons allows for NO persistance
  : 'sqlite:memory';  // one colon allows us to persist - useful today

// something like this will be used in your ACTUAL project:
// const DATABASE_URL = process.env.NODE_ENV === 'test'
//   ? 'sqlite::memory'
//   : process.env.DATABASE_URL;


// instantiate database
const sequelizeDatabase = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});


// use middleware to Allow us to access request body json
app.use(express.json());

// use middleware to Process FORM input and add to request body
app.use(express.urlencoded({ extended: true }));

// Create a Sequelize Model
const UsersModel = sequelizeDatabase.define('Users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  }, password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// Attach beforeCreate Hook to the UserModel.
UsersModel.beforeCreate((user) => {
  console.log('our user', user);
});

// Define basicAuth Middleware.
// Implement on basic-auth-secured routes only. ie.  the '/signin' or '/hello' route
// TODO:

async function basicAuth(req, res, next) {
  let {authorization} = req.headers;
  console.log('authorization', authorization);
  // 1. confirm request header has an "authorization" property
  if(!authorization) {
    res.status(401).send('Not Authorized');
  } else {
    let authString = authorization.split(' ')[1];
    console.log('authString:', authString);

    let decodedAuthString = base64.decode(authString);
    console.log('decodedAuthString:', decodedAuthString);

    let [ username, password ] = decodedAuthString.split(':');
    console.log('username:', username);
    console.log('password', password);

    let user = await UsersModel.findOne({where: { username }});
    console.log('user', user);

    if(user){
      let validUser = await bcrypt.compare(password, user.password);
      if(validUser){
        req.user = user;
        next();
      } else {
        next('Not Authorized');
      }
    }
  }
  // 2. Parse the basic auth string
  // 3. find the user in the database
  // 4. IF the user exists (in database after a signup request)...
  // 5. compare  password from database to the signin password
  // 5a.  note: password could also be sent from a logged in client
  // 6. if valid user DOES exist...
  // 7. attach user to request object
  // 8. basicAuth middleware is done, pass request to next middleware
  // 9. if valid user DOES NOt exist...
  // 10. send a "Not Authorized" error to express middleware

}

// define a signup route to Create new user in database
app.post('/signup', async (req, res, next) => {
  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);

    let user = await UsersModel.create({
      username,
      password: encryptedPassword,
    });
    res.status(200).send(user);
  } catch (error) {
    next('an Error occurred in signup');
  }
});
//define a signin route to Returns user object to client (confirm user auth)

app.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).send('works so far');
});
// define a hello route that uses basic auth to safeguard response content

app.get('/hello', basicAuth, (req, res, next) => {
  let { name } = req.query;
  res.status(200).send();
  res.status(200).send(`Greetings ${name}! this route is now secured by Basic AUth!!!`);
});

// export app for testing, start ability to run app, and our db with ORM
module.exports = {
  server: app,
  start: () => app.listen(PORT, console.log('server running on', PORT)),
  sequelizeDatabase,
};
