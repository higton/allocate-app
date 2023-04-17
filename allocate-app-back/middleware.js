const jwt = require('jsonwebtoken');

// Loads environment variables from .env
require('dotenv').config()
const secret = process.env.SECRET;

function withAuth (req, res, next) {

	let token = '';

	if(req.headers.authorization){
		token = req.headers.authorization.split(' ')[1];
	}

	if (token === '') {
		res.status(401).send('Unauthorized: No token provided');
	} else {
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				res.status(401).send('Unauthorized: Invalid token');
			} else {
				res.username = decoded.username;
				next();
			}
		});
	}
}

module.exports = withAuth;