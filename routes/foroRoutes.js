'use strict'

var express = require('express');
var foroController = require('../controllers/foroController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaForo', foroController.listaForo);
enrutador.post('/guardarForo', foroController.guardarForo);
enrutador.put('/updateForo/:id', foroController.actualizarForo);
enrutador.delete('/eliminarForo/:id', foroController.eliminarForo);
enrutador.post('/subirImagenForo/:id', multiPartyMiddleware, foroController.subirImagenForo);
enrutador.get('/verImagenForo/:imagen', multiPartyMiddleware, foroController.verImagenForo);

module.exports = enrutador;
