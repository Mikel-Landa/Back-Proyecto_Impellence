const db = require('../db');

exports.insertDate = ({ day, month, year }, userId) => {
	return new Promise((resolve, reject) => {
		db.get().query('insert into calendario values(null,?,?,?,?) ', [ month, day, year, userId ], (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};
exports.getVaccationsUser = (pId) => {
	return new Promise((resolve, reject) => {
		db.get().query('select * from calendario where fk_user=?', [ pId ], (err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		});
	});
};
exports.getAllVacationsEmployees = (businessId) => {
	return new Promise((resolve, reject) => {
		db.get().query('select id from usuarios where fk_sede=?', [ businessId ], (err, rows) => {
			if (err) return reject(err);
			let contador = 0;
			let arrVacaciones = [];

			for (let i = 0; i < rows.length; i++) {
				db.get().query('select * from calendario where fk_user=?', [ rows[i].id ], (err, filas) => {
					if (err) return reject(err);
					else if (!filas.length) {
						// console.log(contador);
						contador = contador + 1;
						// console.log(contador);
						// console.log(arrVacaciones);
					}
					else {
						// console.log(filas, 'pepe');
						contador++;
						filas.every((cosa) => arrVacaciones.push(cosa));
					}

					if (contador == rows.length) {
						console.log(arrVacaciones);
						resolve(arrVacaciones);
					}
				});
			}
		});
	});
};
exports.createVacationsCompany = (businessId, { day, month, year }) => {
	return new Promise((resolve, reject) => {
		db.get().query('select id from usuarios where fk_sede=?', [ businessId ], (err, rows) => {
			if (err) return reject(err);
			let arrResult = [];
			function recursiveLoop(i) {
				db
					.get()
					.query(
						'insert into calendario values(null,?,?,?,?) ',
						[ month, day, year, rows[i].id ],
						(err, result) => {
							if (err) return reject(err);
							arrResult.push(result);
							if (arrResult.length == rows.length) return resolve(arrResult);
							i = i + 1;
							recursiveLoop(i);
						}
					);
			}
			recursiveLoop(0);
			// setTimeout(() => resolve(recursiveLoop(0)), 0);
		});
	});
};
// module.exports = {
// 	insertDate: insertDate,
// 	getVaccationsUser: getVaccationsUser,
// 	getAllVacationsEmployees: getAllVacationsEmployees,
// 	createVacationsCompany: createVacationsCompany
// };
