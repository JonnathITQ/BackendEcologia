'use strict'

var express = require('express');
var moderadorController = require('../controllers/moderadorController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaModerador', auth, moderadorController.listaModerador);
enrutador.get('/moderador/:id', auth, moderadorController.verModerador);
enrutador.post('/agregarModerador', auth, moderadorController.agregarModerador);
enrutador.put('/updateModerador/:id', auth, moderadorController.actualizarModerador);
enrutador.delete('/borrarModerador/:id', auth, moderadorController.borrarModerador);
enrutador.post('/subirImagenModerador/:id', [auth, multiPartyMiddleware], moderadorController.subirImagenModerador);
enrutador.get('/verImagenModerador/:imagen', moderadorController.verImagenModerador);
enrutador.post('/loginModerador', moderadorController.loginModerador);

module.exports = enrutador;