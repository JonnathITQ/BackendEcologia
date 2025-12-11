'use strict'

var express = require('express');
var moderadorController = require('../controllers/moderadorController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });



enrutador.get('/listaModerador', moderadorController.listaModerador);
enrutador.get('/moderador/:id', moderadorController.verModerador);
enrutador.post('/agregarModerador', moderadorController.agregarModerador);
enrutador.put('/updateModerador/:id', moderadorController.actualizarModerador);
enrutador.delete('/borrarModerador/:id', moderadorController.borrarModerador);
enrutador.post('/subirImagenModerador/:id', multiPartyMiddleware, moderadorController.subirImagenModerador);
enrutador.get('/verImagenModerador/:imagen', multiPartyMiddleware, moderadorController.verImagenModerador);
enrutador.post('/loginModerador', moderadorController.loginModerador);

module.exports = enrutador;