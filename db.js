const mysql = require('mysql');
let pool = null;
const connect = (done) => {
	pool = mysql.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'appfichar'
	});
	done();
};
const get = () => {
	return pool;
};

module.exports = {
	connect: connect,
	get: get
};
