var express = require('express');
var router = express.Router();
const db = require('../db');
const jwt = require('jwt-simple');

router.use((req, res, next) => {
	req.headers.token = jwt.decode(req.headers.token, 'en un lugar de la mancha');
	next();
});
router.post('/inicial', (req, res) => {
	if (!req.body.inicioTiempo)
		res.json({
			error: 'Parametro inicioTiempo en el body incorrecto'
		});
	db
		.get()
		.query(
			'update usuarios set inicioTiempo=? where id=?',
			[ req.body.inicioTiempo, req.headers.token.userId ],
			(err, result) => {
				if (err) return res.json({ error: err });
				console.log(result);
				res.json({ resultado: result.message });
			}
		);
});

router.post('/transcurrido', (req, res) => {
	if (!req.body.tiempo) return res.json({ error: 'Parametro tiempo en el body incorrecto' });
	db
		.get()
		.query(
			'update usuarios set tiempoTranscurrido=?, pausa=? where id=?',
			[ req.body.tiempo, req.body.pausa, req.headers.token.userId ],
			(err, result) => {
				if (err) return res.json({ error: err });
				res.json({ resultado: result });
			}
		);
});

router.get('/transcurrido', (req, res) => {
	db
		.get()
		.query(
			'select tiempoTranscurrido,inicioTiempo,pausa from usuarios where id=?',
			[ req.headers.token.userId ],
			(err, rows) => {
				if (err) return res.json({ error: err });
				res.json(rows[0]);
			}
		);
});
router.post('/onPause', (req, res) => {
	db
		.get()
		.query(
			'update usuarios set onPause=?  where id=?',
			[ req.body.onPause, req.headers.token.userId ],
			(err, rows) => {
				if (err) return res.json({ error: err });
				res.json(rows);
			}
		);
});

module.exports = router;
