const cookieParser = require('cookie-parser');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');;
const { buildSchema } = require('graphql');
const db = require('./queries');
const withAuth = require('./middleware');

require('dotenv').config()
const secret = process.env.SECRET;

// Build a schema, using GraphQL schema language
let UserSchema = buildSchema(`
  type User {
    id: Int,
    username: String,
    password: String,
  }
  type Query {
    getUser(username: String!): User,
    checkUsername(username: String!): Boolean,
    getUserFromToken: User,
    getUsers: [User],
    checkToken: Boolean,
    isCorrectPassword(password: String!): Boolean,
  }
  type Mutation {
    addUser( username: String!, password: String!): String,
    deleteUser(username: String!): String,
    changePassword(username: String!, newPassword: String!): String,
  }
`);

async function checkToken( request ) {
  return await new Promise((resolve, reject) => {
    let token = '';

    if(request.headers.authorization){
      token = request.headers.authorization.split(' ')[1];
    }

    if(!token){
      reject("Unauthorized: No token provided");
    } else {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          reject("Unauthorized: Invalid token")
        } else {
          resolve(decoded);
        }
      });
    }
  });
}

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const rootResolver = {
  getUsers: async () => {
    const users =  await db.getUsers()
    return users
  },

  checkUsername: async ({ username }, req) => {
    const user = await db.getUser(username)
    if(user){
      return true;
    } else {
      return false;
    }
  },

  getUser: async ({ username }, req) => {
    let userData = await checkToken(req);
    const user = await db.getUser(username)
    return user;
  },

  getUserFromToken: async (args, req) => {
    let userData = '';

    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    let user = {
      username: userData.username,
    }
    return user;
  },

  addUser: async ({ username, password }) => {
    // print parameters
    console.log('username: ', username);
    console.log('password: ', password);

    return await db.createUser({
      username: username,
      password: password,
    })
  },

  deleteUser: async ({ username }, req) => {
    let userData = '';

     await checkToken(req)
    .then((result) => {
      userData = result;
    })
    .catch((err) => {
      return new Error("It is necessary to login")
    });

    if(userData){
      return await db.deleteUser(username);
    } else{
      return new Error("It is necessary to login")
    }
  },

  isCorrectPassword: async ({password}, req) => {
    let userData = '';

     await checkToken(req)
    .then((result) => {
      userData = result;
    })
    .catch((err) => {
      return new Error("It is necessary to login")
    });

    if(userData && password){
      return await db.isCorrectPassword(userData.username, password).then( (same, err) => {
        if (err) {
          return new Error('Internal error please try again');
        } else if (!same) {
          return new Error('Incorrect password');
        } else {
          return true;
        }
      });
    }
  },

  changePassword: async ({username, newPassword}, req) => {
    return await db.changePassword(username, newPassword);
  },

  checkToken: (args, req) => {
    if(checkToken(req) === true){
      return true
    } else{
      return new Error("It is necessary to login")
    }
  },
}

const loggingMiddleware = (req, res, next) => {
  next();
}

let app = express();
var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: true, credentials: true}));

app.options('*', cors());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(loggingMiddleware);

app.use('/graphql', graphqlHTTP({
  schema: UserSchema,
  rootValue: rootResolver,
  graphiql: true,
}));

app.post('/api/authenticate', async function(req, res) {
  const { username, password } = req.body;

  db.getUser(username)
    .then((result, err) => {
      if (err) {
        console.error(err);
        res.status(500)
          .json({ error: 'Internal error please try again' });
      } else if (!result) {
        res.status(401)
          .json({ error: 'Incorrect email or password1' });
      } else {
        db.isCorrectPassword(username, password).then( (same, err) => {
          if (err) {
            res.status(500)
              .json({ error: 'Internal error please try again' });
          } else if (!same) {
            res.status(401)
              .json({ error: 'Incorrect email or password2' });
          } else {
            // Issue token
            const payload = { username };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1d',
            });
          
            res.status(200).send({ auth: true, token: token });
          }
        });
      }
  });
});

// This endpoint uses the middleware
// to check the token from the cookies
// and verify if the user is logged in
app.get('/checkToken', withAuth, function(req, res) {
  res.json({"oki": "doki"});
})
app.listen(process.env.PORT || 4000);