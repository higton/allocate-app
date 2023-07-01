const cookieParser = require('cookie-parser');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { buildSchema } = require('graphql');
const xmlparser = require('express-xml-bodyparser');

const db = require('./queries');
const withAuth = require('./middleware');
const { getExchanges, calculateSolver, connectRabbitMQ } = require('./allocate');

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
    id: Int,
    name: String,
    professor: String,
    group_period: String,
    department: String,
    localthreshold: Int,
    time_slot: String,
    classrooms: String,
    semester_period: String,
    seat_count: Int,
  }
  type Classroom {
    id: Int,
    name: String,
    number_of_seats: Int,
    time_slot: String,
  }
  type Query {
    getUser(email: String!): User,
    checkEmail(email: String!): Boolean,
    getUserFromToken: User,
    getUsers: [User],
    checkToken: Boolean,
    isCorrectPassword(password: String!): Boolean,
    getCourses: [Course],
    getClassrooms: [Classroom],
  }
  type Mutation {
    addUser( 
      email: String!, 
      password: String!
    ): String,
    changePassword(
      email: String!, 
      newPassword: String!
    ): String,
    addCourse(
      name: String!, 
      professor: String!, 
      group_period: String!, 
      department: String!, 
      localthreshold: Int!, 
      time_slot: String!, 
      classrooms: String!,
      semester_period: String!
      seat_count: Int,
    ): String,
    removeCourse(
      course_name: String!,
    ): String,
    editCourse(
      course_name: String!, 
      new_course_name: String!, 
      new_professor: String!, 
      new_group_period: String!, 
      new_department: String!, 
      new_localthreshold: Int!, 
      new_time_slot: String!, 
      new_classrooms: String!,
      new_semester_period: String!
      new_seat_count: Int,
    ): String,
    addClassroom(
      classroom_name: String!, 
      classroom_number_of_seats: Int!, 
      time_slot: String!, 
    ): String,
    removeClassroom(
      classroom_name: String!,
    ): String,
    editClassroom(
      classroom_name: String!, 
      classroom_number_of_seats: Int!, 
      classroom_time_slot: String!
    ): String,
  }
`);

async function checkToken(request) {
  return await new Promise((resolve, reject) => {
    let token = '';

    if (request.headers.authorization) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      reject("Unauthorized: No token provided");
    } else {
      jwt.verify(token, secret, function (err, decoded) {
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
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const rootResolver = {
  getUsers: async () => {
    const users = await db.getUsers()
    return users
  },

  checkEmail: async ({ email }, req) => {
    const user = await db.getUser(email)
    if (user) {
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

  addUser: async ({ email, password }) => {
    return await db.createUser({
      email: email,
      password: password,
    })
  },

  isCorrectPassword: async ({ password }, req) => {
    let userData = '';

    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    if (userData && password) {
      return await db.isCorrectPassword(userData.email, password).then((same, err) => {
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

  changePassword: async ({ email, newPassword }, req) => {
    return await db.changePassword(email, newPassword);
  },

  checkToken: (args, req) => {
    if (checkToken(req) === true) {
      return true
    } else {
      return new Error("It is necessary to login")
    }
  },

  getCourses: async ({ email }, req) => {
    return await db.getCourses();
  },

  addCourse: async (
    {
      name,
      professor,
      group_period,
      department,
      localthreshold,
      time_slot,
      classrooms,
      semester_period,
      seat_count,
    }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    return await db.addCourse(name, professor, group_period, department, localthreshold, time_slot, classrooms, semester_period, seat_count);
  },

  removeCourse: async ({ course_name }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });


    return await db.removeCourse(course_name);
  },

  editCourse: async (
    {
      course_name,
      new_course_name,
      new_professor,
      new_group_period,
      new_department,
      new_localthreshold,
      new_time_slot,
      new_classrooms,
      new_semester_period,
      new_seat_count,
    }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    return await db.editCourse(
      course_name,
      new_course_name,
      new_professor,
      new_group_period,
      new_department,
      new_localthreshold,
      new_time_slot,
      new_classrooms,
      new_semester_period,
      seat_count
    );
  },

  addClassroom: async ({ classroom_name, classroom_number_of_seats, time_slot }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    return await db.addClassroom(classroom_name, classroom_number_of_seats, time_slot);
  },

  removeClassroom: async ({ classroom_name }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    return await db.removeClassroom(classroom_name);
  },

  editClassroom: async ({ classroom_name, classroom_number_of_seats, classroom_time_slot }, req) => {
    await checkToken(req)
      .then((result) => {
        userData = result;
      })
      .catch((err) => {
        return new Error("It is necessary to login")
      });

    return await db.editClassroom(classroom_name, classroom_number_of_seats, classroom_time_slot);
  },

  getClassrooms: async ({ email }, req) => {
    return await db.getClassrooms(email);
  }
}

const loggingMiddleware = (req, res, next) => {
  next();
}

let app = express();
var cors = require('cors');

// use it before all route definitions
app.use(cors({ origin: true, credentials: true }));

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
app.use(xmlparser());
app.use('/graphql', graphqlHTTP({
  schema: UserSchema,
  rootValue: rootResolver,
  graphiql: true,
}));

app.post('/api/authenticate', async function (req, res) {
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
        db.isCorrectPassword(email, password).then((same, err) => {
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
app.get('/checkToken', withAuth, function (req, res) {
  res.json({ "oki": "doki" });
});

app.get('/exchanges', getExchanges);
app.post('/calculate/:solver', calculateSolver);

connectRabbitMQ();

app.listen(process.env.PORT || 4000);