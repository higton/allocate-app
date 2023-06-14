const bcrypt = require('bcrypt');
const Pool = require('pg').Pool;

require('dotenv').config()

const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  ssl: false,
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
	pool.query(`
		CREATE TABLE IF NOT EXISTS COURSE (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL,
			professor VARCHAR(255) NOT NULL,
			group_period VARCHAR(50) NOT NULL,
			department VARCHAR(50) NOT NULL,
			localthreshold INT NOT NULL,
			time_slot VARCHAR(600) NOT NULL,
			classrooms VARCHAR(600) NOT NULL,
			semester_period VARCHAR(20) NOT NULL,
			account_email VARCHAR(50) NOT NULL
		)
		`, (res, err) => {
		console.log(res, err);
	})

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
			number_of_seats INT NOT NULL,
			time_slot VARCHAR(500) NOT NULL,
			account_email VARCHAR(50) NOT NULL
		)
	`, (res, err) => {
		console.log(res, err);
	})

	// wait for the previous queries to finish
	await new Promise(resolve => setTimeout(resolve, 5000));
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

async function getCoursesFromAccount(email){
	return pool.query(
		'SELECT * FROM COURSE WHERE account_email = ($1)', [email])
	.then((response) => {
		return response.rows;
	})
	.catch((err) => {
		return new Error(err);
	})
}

async function addCourseToAccount(account_email, name, professor, group_period, department, localthreshold, time_slot, classrooms, semester_period){
	return pool.query(`
		INSERT INTO COURSE (name, professor, group_period, department, localthreshold, time_slot, classrooms, semester_period, account_email)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		 [name, professor, group_period, department, localthreshold, time_slot, classrooms, semester_period, account_email]
	).then((response) => {
		return "Course added to user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function removeCourseFromAccount(account_email, course_name){
	return pool.query(`
		DELETE FROM COURSE
		WHERE name = ($2)
		AND account_email = ($1)`,
		 [account_email, course_name]
	).then((response) => {
		return "Course removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
};

async function editCourseFromAccount(
	account_email,
	course_name,
	new_name,
	new_professor,
	new_group_period,
	new_department,
	new_localthreshold,
	new_time_slot,
	new_classrooms,
	new_semester_period
){
	return pool.query(`
		UPDATE COURSE
		SET name = ($2),
		professor = ($3),
		group_period = ($4),
		department = ($5),
		localthreshold = ($6),
		time_slot = ($7),
		classrooms = ($8),
		semester_period = ($9)
		WHERE name = ($1)
		AND account_email = ($10)`,
		 [course_name, new_name, new_professor, new_group_period, new_department, new_localthreshold, new_time_slot, new_classrooms, new_semester_period, account_email]
	).then((response) => {
		return "Course edited!"
	}).catch((error) => {
		return new Error(error);
	});
};

async function addClassroomToAccount(account_email, classrom_name, classroom_number_of_seats, classroom_time_slot){
	return pool.query(`
		INSERT INTO CLASSROOM (name, number_of_seats, time_slot, account_email)
		VALUES ($1, $2, $3, $4)`,
		 [classrom_name, classroom_number_of_seats, classroom_time_slot, account_email]
	).then((response) => {
		return "Classroom added to user!"
	}).catch((error) => {
		return new Error(error);
	})
}

async function removeClassroomFromAccount(account_email, classroom_name){
	return pool.query(`
		DELETE FROM CLASSROOM
		WHERE name = ($2)
		AND account_email = ($1)`,
		 [account_email, classroom_name]
	).then((response) => {
		return "Classroom removed from user!"
	}).catch((error) => {
		return new Error(error);
	})
}

async function editClassroomFromAccount(account_email, name, new_number_of_seats, new_time_slot){
	return pool.query(`
		UPDATE CLASSROOM
		SET number_of_seats = ($3),
		time_slot = ($4)
		WHERE name = ($2)
		AND account_email = ($1)`,
		 [account_email, name, new_number_of_seats, new_time_slot]
	).then((response) => {
		return "Classroom edited!"
	}).catch((error) => {
		return new Error(error);
	});
}

async function getClassroomsFromAccount(account_email){
	return pool.query(`
		SELECT * FROM CLASSROOM
		WHERE account_email = ($1)`,
		 [account_email]
	).then((response) => {
		return response.rows;
	}).catch((error) => {
		return new Error(error);
	})
}

module.exports = {
	getUsers,
	getUser,
	getCoursesFromAccount,
	createUser,
	isCorrectPassword,
	changePassword,
	addCourseToAccount,
	removeCourseFromAccount,
	editCourseFromAccount,
	addClassroomToAccount,
	removeClassroomFromAccount,
	editClassroomFromAccount,
	getClassroomsFromAccount,
};