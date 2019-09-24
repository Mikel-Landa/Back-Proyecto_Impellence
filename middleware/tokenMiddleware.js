const jwt = require('jwt-simple');
module.exports = (req, res, next) => {
	console.log(req.url);
	if (
		req.url == '/business/register' ||
		req.url == '/users/login' ||
		req.url == '/business/login' ||
		req.url == '/users/register'
	)
		return next();
	let token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	if (token.expiresAt + 1 <= new Date().getDate()) return res.json({ error: 'Token caducado' });
	next();
};
