'use strict'

var express = require('express');
var usuarioController = require('../controllers/usuarioController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });



enrutador.get('/listaUsuario', usuarioController.listaUsuario);
enrutador.get('/usuario/:id', usuarioController.verUsuario);
enrutador.post('/agregarUsuario', usuarioController.agregarUsuario);
enrutador.put('/updateUsuario/:id', usuarioController.actualizarUsuario);
enrutador.delete('/borrarUsuario/:id', usuarioController.borrarUsuario);
enrutador.post('/subirImagenUsuario/:id', multiPartyMiddleware, usuarioController.subirImagenUsuario);
enrutador.get('/verImagenUsuario/:imagen', multiPartyMiddleware, usuarioController.verImagenUsuario);
enrutador.post('/loginUsuario', usuarioController.loginUsuario);
enrutador.post('/getUserIdByEmail', usuarioController.getUserIdByEmail);
enrutador.put('/resetPassword/:id', usuarioController.resetPassword);

module.exports = enrutador;