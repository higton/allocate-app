const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;

require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('error', (err, client) => {
	console.error('Error:', err);
});

init();

async function init(){
	// for each table modify the primary key to be a autoincrementing id
	pool.query(`
		CREATE TABLE IF NOT EXISTS COURSE (
			id SERIAL PRIMARY KEY,
			name VARCHAR(30) NOT NULL,
			number_of_students INT NOT NULL
		)
		`, (res, err) => {
		console.log(res, err);
	})

	// email has to be unique
	pool.query(`
		CREATE TABLE IF NOT EXISTS ACCOUNT (
			id SERIAL PRIMARY KEY,
			email VARCHAR(30) UNIQUE NOT NULL,
			password VARCHAR(200) NOT NULL
		)
		`, (res, err) => {
		console.log(res, err);
	})

	pool.query(`
		CREATE TABLE IF NOT EXISTS CLASSROOM (
			id SERIAL PRIMARY KEY,
			name VARCHAR(30) NOT NULL,
			number_of_seats INT NOT NULL
		)
	`, (res, err) => {
		console.log(res, err);
	})

	// wait for the previous queries to finish
	await new Promise(resolve => setTimeout(resolve, 5000));

	pool.query(`
		CREATE TABLE IF NOT EXISTS COURSES_ACCOUNT (
			id SERIAL PRIMARY KEY,
			fk_account_id INT NOT NULL,
			fk_course_id INT NOT NULL,

			FOREIGN KEY (fk_account_id) REFERENCES ACCOUNT (id),
			FOREIGN KEY (fk_course_id) REFERENCES COURSE (id)
		)
		`, (res, err) => {
		console.log(res, err);
	})

	pool.query(`
		CREATE TABLE IF NOT EXISTS CLASSROOMS_ACCOUNT (
			id SERIAL PRIMARY KEY,
			fk_account_id INT NOT NULL,
			fk_classroom_id INT NOT NULL,

			FOREIGN KEY (fk_account_id) REFERENCES ACCOUNT (id),
			FOREIGN KEY (fk_classroom_id) REFERENCES CLASSROOM (id)
		)
		`, (res, err) => {
		console.log(res, err);
	})
}

const saltRounds = 10;

async function getUsers(){
	return pool.query('select * FROM ACCOUNT').then((response) => {
    return response.rows
  }).catch((error) => {
  	return new Error(error);
  })
}

async function getUser(email){
	return pool.query(
		'SELECT * FROM ACCOUNT WHERE email = ($1)', [email])
	.then((response) => {
		return response.rows[0];
	})
	.catch((err) => {
		return new Error(err);
	})
}

async function getCoursesFromAccount(email){
	return pool.query(`
		SELECT name, number_of_students FROM COURSES_ACCOUNT
		JOIN ACCOUNT ON ACCOUNT.id = fk_account_id
		JOIN COURSE ON COURSE.id = fk_course_id
		WHERE ACCOUNT.email = ($1)`,
		[email]
	).then((response) => {
		return response.rows;
	}).catch((error) => {
		return new Error(error);
	})
}

async function createUser(request){
	let { email, password } = request

	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, function(err, hash) {
		  if (err) reject(err)
		  resolve(hash)
		});
	})

	let tmp = await this.getUser(email);

	if(!tmp && hashedPassword){
		return pool.query(
			'INSERT INTO ACCOUNT (email, password) VALUES ($1, $2)',
			 [email, hashedPassword]
		)
		.then(() => {
			return "User added!"
		}).catch((error) => {
			return new Error(error);
		})
	} else {
		return new Error("This account already exist");
	}
}

async function isCorrectPassword(email, password){
	const user = await getUser(email);

	return await new Promise((resolve, reject) => {
		bcrypt.compare(password, user.password, function(err, same) {
			if(err){
				reject(err);
			} else {
				resolve(same);
			}
		})
	});
}

async function changePassword(email, newPassword){
	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(newPassword, saltRounds, function(err, hash) {
		  if (err) reject(err)
		  resolve(hash)
		});
	})
	
	return pool.query(
		'UPDATE ACCOUNT SET password = ($1) WHERE email = ($2)', [hashedPassword, email])
	.then(() => {
		return "Password changed!";
	}).catch((error) => {
		return new Error(error);
	});
};

async function addCourse(name, number_of_students){
	return pool.query(
		'INSERT INTO COURSE (name, number_of_students) VALUES ($1, $2)',
		 [name, number_of_students]
	)
	.then((response) => {
		return "Course added!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function addCourseToAccount(account_email, course_name){
	return pool.query(`
		INSERT INTO COURSES_ACCOUNT (fk_account_id, fk_course_id)
		SELECT ACCOUNT.id, COURSE.id FROM ACCOUNT, COURSE 
		WHERE ACCOUNT.email = ($1)
		AND COURSE.name = ($2)`,
		 [account_email, course_name]
	).then((response) => {
		return "Course added to user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function removeCourseFromAccount(account_email, course_name){
	return pool.query(`
		DELETE FROM COURSES_ACCOUNT
		WHERE fk_account_id IN (SELECT id FROM ACCOUNT WHERE email = $1)
		AND fk_course_id IN (SELECT id FROM COURSE WHERE name = $2)`,
		 [account_email, course_name]
	).then((response) => {
		return "Course removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function editCourseFromAccount(account_email, new_course_name, new_number_of_students){
	return pool.query(`
		UPDATE COURSE 
			SET name = $1, number_of_students = $2
		FROM COURSES_ACCOUNT
		WHERE COURSES_ACCOUNT.fk_account_id = (SELECT id FROM ACCOUNT WHERE email = $3)
		AND COURSES_ACCOUNT.fk_course_id = COURSE.id`,
		 [new_course_name, new_number_of_students, account_email]
	).then((response) => {
		return "Course edited from user!"
	}).catch((error) => {
		// print error
		console.log(error);
		return new Error(error);
	})
};


async function addClassroom(name, number_of_seats){
	return pool.query(
		'INSERT INTO CLASSROOM (name, number_of_seats) VALUES ($1, $2)',
		 [name, number_of_seats]
	)
	.then((response) => {
		return "Classroom added!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function addClassroomToAccount(account_email, classrom_name){
	return pool.query(`
		INSERT INTO CLASSROOMS_ACCOUNT (fk_account_id, fk_classroom_id)
		SELECT ACCOUNT.id, CLASSROOM.id FROM ACCOUNT, CLASSROOM
		WHERE ACCOUNT.email = ($1)
		AND CLASSROOM.name = ($2)`,
		 [account_email, classrom_name]
	).then((response) => {
		return "Classroom added to user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function removeClassroomFromAccount(account_email, classroom_id){
	return pool.query(`
		DELETE FROM CLASSROOMS_ACCOUNT
		WHERE fk_account_id IN (SELECT id FROM ACCOUNT WHERE email = $1)
		AND fk_classroom_id = $2`,
		 [account_email, classroom_id]
	).then((response) => {
		return "Classroom removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function getClassroomIdFromAccount(account_email, classroom_name){
	return pool.query(`
		SELECT CLASSROOM.id FROM CLASSROOM
		WHERE CLASSROOM.name = $1
		AND CLASSROOM.id IN (SELECT fk_classroom_id FROM CLASSROOMS_ACCOUNT WHERE fk_account_id = (SELECT id FROM ACCOUNT WHERE email = $2))`,
		 [classroom_name, account_email]
	).then((response) => {
		return response.rows[0].id;
	}).catch((error) => {
		return new Error(error);
	})
};

// create a function that removes a classrom from a classrom_id
async function removeClassroom(classroom_id){
	return pool.query(`
		DELETE FROM CLASSROOM WHERE id = $1`,
		 [classroom_id]
	).then((response) => {
		return "Classroom removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
}

async function editClassroomFromAccount(account_email, new_classroom_name, new_number_of_seats){
	return pool.query(`
		UPDATE CLASSROOM
			SET name = $1, number_of_seats = $2
		FROM CLASSROOMS_ACCOUNT
		WHERE CLASSROOMS_ACCOUNT.fk_account_id = (SELECT id FROM ACCOUNT WHERE email = $3)
		AND CLASSROOMS_ACCOUNT.fk_classroom_id = CLASSROOM.id`,
		 [new_classroom_name, new_number_of_seats, account_email]
	).then((response) => {
		return "Classroom edited from user!"
	}).catch((error) => {
		console.log(error);
		return new Error(error);
	})
};

async function getClassroomsFromAccount(account_email){
	return pool.query(`
		SELECT CLASSROOM.name, CLASSROOM.number_of_seats
		FROM CLASSROOM, CLASSROOMS_ACCOUNT
		WHERE CLASSROOMS_ACCOUNT.fk_account_id = (SELECT id FROM ACCOUNT WHERE email = ($1))
		AND CLASSROOMS_ACCOUNT.fk_classroom_id = CLASSROOM.id`,
		 [account_email]
	).then((response) => {
		return response.rows;
	}).catch((error) => {
		return new Error(error);
	})
};

async function removeCourse(course_id){
	return pool.query(`
		DELETE FROM COURSE WHERE id = $1`,
		 [course_id]
	).then((response) => {
		return "Course removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function getCourseIdFromAccount(account_email, course_name){
	return pool.query(`
		SELECT COURSE.id FROM COURSE
		WHERE COURSE.name = $1
		AND COURSE.id IN (SELECT fk_course_id FROM COURSES_ACCOUNT WHERE fk_account_id = (SELECT id FROM ACCOUNT WHERE email = $2))`,
		 [course_name, account_email]
	).then((response) => {
		return response.rows[0].id;
	}).catch((error) => {
		return new Error(error);
	})
};

module.exports = {
	getUsers,
	getUser,
	getCoursesFromAccount,
	createUser,
	isCorrectPassword,
	changePassword,
	addCourse,
	addCourseToAccount,
	removeCourseFromAccount,
	editCourseFromAccount,
	addClassroom,
	addClassroomToAccount,
	removeClassroomFromAccount,
	editClassroomFromAccount,
	getClassroomsFromAccount,
	getClassroomIdFromAccount,
	removeClassroom,
	removeCourse,
	getCourseIdFromAccount,
};