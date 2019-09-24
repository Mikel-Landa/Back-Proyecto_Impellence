const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const calendarModel = require('../models/calendar');

router.post('/', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	calendarModel.insertDate(req.body, req.headers.token.userId).then((result) => res.json(result)).catch((err) => {
		res.json({ error: err });
	});
});
router.get('/', (req, res) => {
	let id = jwt.decode(req.headers.token, 'en un lugar de la mancha').userId;
	calendarModel.getVaccationsUser(id).then((rows) => res.json(rows)).catch((err) => res.json({ error: err }));
});
router.get('/all', (req, res) => {
	let id = jwt.decode(req.headers.token, 'en un lugar de la mancha').id;
	// console.log(id);
	calendarModel
		.getAllVacationsEmployees(id)
		.then((response) => {
			// console.log(response);
			res.json(response);
		})
		.catch((err) => {
			res.json({ error: err });
		});
});
router.post('/company', (req, res) => {
	let id = jwt.decode(req.headers.token, 'en un lugar de la mancha').id;

	calendarModel
		.createVacationsCompany(id, req.body)
		.then((result) => {
			res.json(result);
		})
		.catch((err) =>
			res.json({
				error: err
			})
		);
});

module.exports = router;
