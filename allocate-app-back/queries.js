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
	await pool.query(`
			CREATE TABLE IF NOT EXISTS users (
			    username varchar UNIQUE,
			    password varchar
			)
		`, (res, err) => {
		console.log(res, err);
	})
}

const saltRounds = 10;

async function getUsers(){
	return pool.query('select * FROM users').then((response) => {
    return response.rows
  }).catch((error) => {
  	return new Error(error);
  })
}

async function getUser(username){
	return pool.query(
		'SELECT * FROM users WHERE username = ($1)', [username])
	.then((response) => {
		console.log('reponse', response.rows);
		return response.rows[0];
	})
	.catch((err) => {
		return new Error(err);
	})
}

async function createUser(request){
	let { username, password } = request

	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, function(err, hash) {
		  if (err) reject(err)
		  resolve(hash)
		});
	})

	let tmp = await this.getUser(username);

	if(!tmp && hashedPassword){
		return pool.query(
			'INSERT INTO users (username, password) VALUES ($1, $2)',
			 [username, hashedPassword]
		)
		.then((response) => {
			console.log('response', response);
			return "User added!"
		}).catch((error) => {
			// print error
			console.log('error', error);
			return new Error(error);
		})
	} else {
		return new Error("This username already exist");
	}
}

async function isCorrectPassword(username, password){
		const user = await getUser(username);

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

async function deleteUser(username){
	return pool.query(
		'DELETE FROM users WHERE username = ($1)', [username])
	.then((response) => {
		return "User removed!123";
	}).catch((err) =>{
		return new Error(err);
	});
}

async function changePassword(username, newPassword){
	console.log('username', username);
	console.log('newPassword', newPassword);

	const hashedPassword = await new Promise((resolve, reject) => {
		bcrypt.hash(newPassword, saltRounds, function(err, hash) {
		  if (err) reject(err)
		  resolve(hash)
		});
	})
	
	return pool.query(
		'UPDATE users SET password = ($1) WHERE username = ($2)', [hashedPassword, username])
	.then((response) => {
		console.log('response', response);
		return "Password changed!";
	}).catch((error) => {
		return new Error(error);
	});
};

module.exports = {
	getUsers,
	getUser,
	createUser,
	deleteUser,
	isCorrectPassword,
	changePassword
}