const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const statsModel = require('../models/stats');
const usersModel = require('../models/users');

router.get('/', async (req, res) => {
	try {
		let id = jwt.decode(req.headers.token, 'en un lugar de la mancha').userId;
		let stats = await statsModel.getAllStats(id);
		res.json(stats);
	} catch (err) {
		res.json({ error: err });
	}
});
router.post('/business', (req, res) => {
	let businessId = jwt.decode(req.headers.token, 'en un lugar de la mancha').id;
	statsModel.getCompanyAverage(businessId).then((rows) => res.json(rows)).catch((err) => res.json(err));
});
router.get('/company', (req, res) => {
	let username = jwt.decode(req.headers.token, 'en un lugar de la mancha').username;
	usersModel
		.getByUsername(username)
		.then((rows) => {
			statsModel
				.getCompanyAverage(rows.fk_sede)
				.then((rows) => res.json(rows))
				.catch((err) => res.json({ error: err }));
		})
		.catch((err) => res.json({ error: err }));
});
console.log('holis');
router.get('/business', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	statsModel
		.getCompanyAverage(req.headers.token.id)
		.then((rows) => res.json(rows))
		.catch((err) => res.json({ error: err }));
});
router.get('/numberEmployees', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	statsModel
		.getNumEmployees(req.headers.token.id)
		.then((rows) => res.json(rows))
		.catch((err) => res.json({ error: err }));
});
router.post('/month', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	statsModel.getAllStatsByMonth(req.headers.token.id, req.body.month).then((rows) => res.json(rows)).catch((err) =>
		res.json({
			error: err
		})
	);
});
router.get('/active', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	statsModel
		.getActiveUsers(req.headers.token.id)
		.then((result) => res.json(result))
		.catch((err) => res.json({ error: err }));
});
router.post('/active', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	statsModel
		.getEmployeesFilterByActive(req.headers.token.id, req.body.active)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.json({ error: err }));
});
module.exports = router;
