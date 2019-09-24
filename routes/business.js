const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const businessModel = require('../models/business');

router.post('/register', (req, res) => {
	req.body.password = bcrypt.hashSync(req.body.password, 10);
	businessModel.insert(req.body).then((response) => res.json(response)).catch((err) => res.json({ error: err }));
});

router.post('/login', async (req, res) => {
	try {
		let business = await businessModel.getByUsername(req.body.username);
		if (!business) return res.json({ mensaje: 'Usuario/contraseña inválido/s' });
		bcrypt.compare(req.body.password, business.password, (err, same) => {
			if (err) return res.json({ error: 'Ha ocurrido un error,inténtelo más tarde' });
			if (!same) return res.json({ mensaje: 'Usuario/contraseña inválido/s' });
			res.json({ token: createToken(business.id, business.username) });
		});
	} catch (err) {
		res.json({ error: err });
	}
});

const createToken = (id, username) => {
	const payload = {
		id: id,
		username: username,
		expiresAt: new Date().getDate()
	};
	return jwt.encode(payload, 'en un lugar de la mancha');
};

module.exports = router;
