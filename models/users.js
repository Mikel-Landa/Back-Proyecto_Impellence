const db = require('../db');

exports.insert = ({ username, password, email }) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await this.getByUsername(username);
			console.log(user);
			if (user) return resolve({ mensaje: 'Usuario no válido' });
		} catch (err) {
			return reject(err);
		}

		db
			.get()
			.query(
				'insert into usuarios values(null,?,?,?,null,null)',
				[ username, password, email ],
				(err, response) => {
					if (err) return reject(err);
					resolve(response);
				}
			);
	});
};

exports.getByUsername = (pUsername) => {
	return new Promise((resolve, reject) => {
		db.get().query('select * from usuarios where username=?', [ pUsername ], (err, rows) => {
			if (err) return reject(err);
			if (rows.length == 0) return resolve(null);
			resolve(rows[0]);
		});
	});
};
