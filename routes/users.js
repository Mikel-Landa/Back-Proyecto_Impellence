var express = require('express');
var router = express.Router();
const usersModel = require('../models/users');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.post('/register', (req, res) => {
	if (!req.body.username || !req.body.password)
		return res.json({ error: 'Body incorrecto, necesita password y username' });
	req.body.password = bcrypt.hashSync(req.body.password, 10);
	usersModel.insert(req.body).then((response) => res.json(response)).catch((err) => res.json({ error: err }));
});
router.post('/login', async (req, res) => {
	try {
		let user = await usersModel.getByUsername(req.body.username);
		if (!user) return res.json({ error: 'Usuario/contraseña no valido/s' });
		bcrypt.compare(req.body.password, user.password, (err, same) => {
			if (err) return res.json({ error: 'Intentalo más tarde' });
			if (!same) return res.json({ error: 'Usuario/contraseña no valido/s' });
			res.json({ token: createToken(user) });
		});
	} catch (err) {
		res.json({ error: err });
	}
});

const createToken = ({ id, username }) => {
	const payload = {
		userId: id,
		username: username,
		expiresAt: new Date().getDate()
	};
	return jwt.encode(payload, 'en un lugar de la mancha');
};

module.exports = router;
