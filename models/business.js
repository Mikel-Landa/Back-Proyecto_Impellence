const db = require('../db');

exports.insert = ({ username, password, email, official_name }) => {
	return new Promise(async (resolve, reject) => {
		try {
			let user = await this.getByUsername(username);
			if (user) return resolve({ mensaje: 'Usuario no válido' });
		} catch (err) {
			return reject(err);
		}

		db
			.get()
			.query(
				'insert into empresas values(null,?,?,?,?,?,?,?,?)',
				[
					username,
					password,
					email,
					official_name,
					new Date().getDate(),
					new Date().getMonth() + 1,
					new Date().getFullYear(),
					0
				],
				(err, response) => {
					if (err) return reject(err);
					resolve(response);
				}
			);
	});
};

exports.getByUsername = (pUsername) => {
	return new Promise((resolve, reject) => {
		db.get().query('select * from empresas where username=?', [ pUsername ], (err, rows) => {
			if (err) return reject(err);
			if (rows.length == 0) return resolve(null);
			resolve(rows[0]);
		});
	});
};
