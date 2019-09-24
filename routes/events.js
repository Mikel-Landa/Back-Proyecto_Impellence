const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');

const manejarTiempo = require('../models/manejarTiempo.model');

router.post('/new', (req, res) => {
	req.body.fk_user = jwt.decode(req.headers.token, 'en un lugar de la mancha').userId;
	console.log(req.body.fk_user);
	manejarTiempo
		.insert(req.body)
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.json({ error: err }));
});
router.put('/update', (req, res) => {
	manejarTiempo.update(req.body).then((result) => res.json(result)).catch((err) => res.json(err));
});
router.get('/day', (req, res) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha').userId;
	manejarTiempo
		.getDayByUserId(req.headers.token)
		.then((rows) => {
			if (typeof rows == 'string') return res.json({ error: rows });
			res.json({ rows: rows });
		})
		.catch((err) => res.json({ error: err }));
});

module.exports = router;
