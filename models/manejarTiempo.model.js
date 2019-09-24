const db = require('../db');
exports.insert = ({ month, day, startHour = 0, endHour = 0, numPauses = 0, totalPauseT = 0, fk_user }) => {
	return new Promise(async (resolve, reject) => {
		if (month != new Date().getMonth() + 1 || day != new Date().getDate()) return reject('Día incorrecto');

		try {
			let comprobar = await this.getDayByUserId(fk_user);
			if (comprobar != null) return reject('Ya hay una entrada hoy');
			db
				.get()
				.query(
					'insert into eventos values(?,?,?,?,?,?,?,?,?)',
					[ null, new Date().getFullYear(), month, day, startHour, endHour, numPauses, totalPauseT, fk_user ],
					(err, res) => {
						if (err) reject(err);
						resolve(res);
					}
				);
		} catch (err) {
			reject(err);
		}
	});
};

exports.update = ({ field, value, field2, value2, fk_user, month, day }) => {
	return new Promise((resolve, reject) => {
		db
			.get()
			.query(
				`update eventos set ${field}=?,${field2}=? where fk_user=? and month=? and day=? `,
				[ value, value2, fk_user, new Date().getMonth() + 1, new Date().getDate() ],
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				}
			);
	});
};
exports.getDayByUserId = (pId) => {
	return new Promise((resolve, reject) => {
		db
			.get()
			.query(
				'select * from eventos where fk_user =? and month=? and day=?',
				[ pId, new Date().getMonth() + 1, new Date().getDate() ],
				(err, rows) => {
					if (err) return reject(err);
					if (rows.length == 0) return resolve(null);
					resolve(rows[0]);
				}
			);
	});
};
