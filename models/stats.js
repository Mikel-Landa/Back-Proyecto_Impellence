const db = require('../db');

exports.getAllStats = (userId, month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
	return new Promise((resolve, reject) => {
		db
			.get()
			.query(
				'select * from eventos where fk_user=? and year=? and month=? order by day',
				[ userId, year, month ],
				(err, rows) => {
					if (err) return reject(err);
					if (rows.length == 0) resolve(null);
					resolve(rows);
				}
			);
	});
};
exports.getEmployeesFromCompanyId = (businessId) => {
	return new Promise((resolve, reject) => {
		db.get().query('select id from usuarios where fk_sede=? ', [ businessId ], (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
};
exports.getCompanyAverage = (businessId) => {
	return new Promise(async (resolve, reject) => {
		let arrStats = [];
		try {
			var usersId = await this.getEmployeesFromCompanyId(businessId);
			if (usersId.length == 0) return resolve(null);
		} catch (err) {
			reject(err);
		}
		let proms = [];
		for (userId of usersId) {
			proms.push(
				new Promise((resolve, reject) => {
					db.get().query('select * from eventos where fk_user=?', userId.id, (err, rows) => {
						// console.log(rows);
						if (err) return reject(err);
						resolve(rows);
					});
				})
			);
		}
		await Promise.all(proms).then((results) => {
			for (row of results) {
				for (inrow of row) arrStats.push(inrow);
			}
		});
		// console.log(arrStats);
		resolve(arrStats);
	});
};

exports.getNumEmployees = (businessId) => {
	return new Promise((resolve, reject) => {
		db.get().query('select count(*) from usuarios where fk_sede=?', [ businessId ], (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
};

exports.getAllStatsByMonth = (businessId, pMonth) => {
	return new Promise(async (resolve, reject) => {
		let arrStats = [];
		try {
			var usersId = await this.getEmployeesFromCompanyId(businessId);
			if (usersId.length == 0) return resolve(null);
		} catch (err) {
			reject(err);
		}
		let proms = [];
		for (userId of usersId) {
			proms.push(
				new Promise((resolve, reject) => {
					db
						.get()
						.query(
							'select * from eventos where fk_user=? and month=?',
							[ userId.id, pMonth ],
							(err, rows) => {
								// console.log(rows);
								if (err) return reject(err);
								resolve(rows);
							}
						);
				})
			);
		}
		await Promise.all(proms).then((results) => {
			for (row of results) {
				for (inrow of row) arrStats.push(inrow);
			}
		});
		// console.log(arrStats);
		resolve(arrStats);
	});
};
exports.getActiveUsers = (businessId) => {
	return new Promise((resolve, reject) => {
		db
			.get()
			.query('select count(*) from usuarios where fk_sede=? and onPause=?', [ businessId, 0 ], (err, rows) => {
				if (err) return reject(err);
				resolve(rows);
			});
	});
};
exports.getEmployeesFilterByActive = (businessId, active) => {
	return new Promise((resolve, reject) => {
		db
			.get()
			.query(
				'select * from usuarios where fk_sede=? and onPause=? order by pausa desc ',
				[ businessId, active ],
				(err, rows) => {
					if (err) return reject(err);
					resolve(rows);
				}
			);
	});
};
