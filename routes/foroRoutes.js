'use strict'

var express = require('express');
var foroController = require('../controllers/foroController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaForo', foroController.listaForo);
enrutador.post('/guardarForo', auth, foroController.guardarForo);
enrutador.put('/updateForo/:id', auth, foroController.actualizarForo);
enrutador.delete('/eliminarForo/:id', auth, foroController.eliminarForo);
enrutador.post('/subirImagenForo/:id', [auth, multiPartyMiddleware], foroController.subirImagenForo);
enrutador.get('/verImagenForo/:imagen', foroController.verImagenForo);

module.exports = enrutador;
