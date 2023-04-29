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
    email: String,
    password: String,
  }
  type Course {
    name: String,
    professor: String,
    group_period: String,
    department: String,
    localthreshold: Int,
    time_slot: String,
  }
  type Classroom {
    name: String,
    number_of_seats: Int,
  }
  type Query {
    getUser(email: String!): User,
    checkEmail(email: String!): Boolean,
    getUserFromToken: User,
    getUsers: [User],
    checkToken: Boolean,
    isCorrectPassword(password: String!): Boolean,
    getCoursesFromAccount(email: String!): [Course],
    getClassroomsFromAccount(email: String!): [Classroom],
  }
  type Mutation {
    addUser( email: String!, password: String!): String,
    changePassword(email: String!, newPassword: String!): String,
    addCourseToAccount(name: String!, professor: String!, group_period: String!, department: String!, localthreshold: Int!, time_slot: String!, account_email: String!): String,
    removeCourseFromAccount(course_name: String!, account_email: String!): String,
    editCourseFromAccount(account_email: String!, course_name: String!, new_course_name: String!, new_professor: String!, new_group_period: String!, new_department: String!, new_localthreshold: Int!, new_time_slot: String!): String,
    addClassroomToAccount(classroom_name: String!, classroom_number_of_seats: Int!, account_email: String!): String,
    removeClassroomFromAccount(classroom_name: String!, account_email: String!): String,
    editClassroomFromAccount(account_email: String!, classroom_name: String!, classroom_number_of_seats: Int!): String,
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

  checkEmail: async ({ email }, req) => {
    const user = await db.getUser(email)
    if(user){
      return true;
    } else {
      return false;
    }
  },

  getUser: async ({ email }, req) => {
    let userData = await checkToken(req);
    const user = await db.getUser(email)
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
      email: userData.email,
    }
    return user;
  },

  getCoursesFromAccount: async ({email}, req) => {
    return await db.getCoursesFromAccount(email);
  },

  addUser: async ({ email, password }) => {
    return await db.createUser({
      email: email,
      password: password,
    })
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
      return await db.isCorrectPassword(userData.email, password).then( (same, err) => {
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

  changePassword: async ({email, newPassword}, req) => {
    return await db.changePassword(email, newPassword);
  },

  checkToken: (args, req) => {
    if(checkToken(req) === true){
      return true
    } else{
      return new Error("It is necessary to login")
    }
  },

  addCourseToAccount: async ({ name, professor, group_period, department, localthreshold, time_slot, account_email }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    // print name
    console.log("name: " + name);
    await db.addCourse(name, professor, group_period, department, localthreshold, time_slot);

    return await db.addCourseToAccount(account_email, name);
  },

  removeCourseFromAccount: async ({ account_email, course_name }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    course_id = await db.getCourseIdFromAccount(account_email, course_name);
    await db.removeCourseFromAccount(account_email, course_name);
    return await db.removeCourse(course_id);
  },

  editCourseFromAccount: async ({ account_email, course_name, new_course_name, new_professor, new_group_period, new_department, new_localthreshold, new_time_slot }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    let course_id = await db.getCourseIdFromAccount(account_email, course_name);

    return await db.editCourseFromAccount(account_email, course_id, new_course_name, new_professor, new_group_period, new_department, new_localthreshold, new_time_slot);
  },

  addClassroomToAccount: async ({ classroom_name, classroom_number_of_seats, account_email }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    await db.addClassroom(classroom_name, classroom_number_of_seats);

    return await db.addClassroomToAccount(account_email, classroom_name, classroom_number_of_seats);
  },

  removeClassroomFromAccount: async ({ account_email, classroom_name }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    classroom_id = await db.getClassroomIdFromAccount(account_email, classroom_name);
    await db.removeClassroomFromAccount(account_email, classroom_id);
    return await db.removeClassroom(classroom_id);
  },

  editClassroomFromAccount: async ({ account_email, classroom_name, classroom_number_of_seats }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });
    
    return await db.editClassroomFromAccount(account_email, classroom_name, classroom_number_of_seats);
  },

  getClassroomsFromAccount: async ({email}, req) => {
    return await db.getClassroomsFromAccount(email);
  }
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
  const { email, password } = req.body;

  db.getUser(email)
    .then((result, err) => {
      if (err) {
        console.error(err);
        res.status(500)
          .json({ error: 'Internal error please try again' });
      } else if (!result) {
        res.status(401)
          .json({ error: 'Incorrect email or password' });
      } else {
        db.isCorrectPassword(email, password).then( (same, err) => {
          if (err) {
            res.status(500)
              .json({ error: 'Internal error please try again' });
          } else if (!same) {
            res.status(401)
              .json({ error: 'Incorrect email or password2' });
          } else {
            // Issue token
            const payload = { email };
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