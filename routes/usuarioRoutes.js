'use strict'

var express = require('express');
var usuarioController = require('../controllers/usuarioController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaUsuario', auth, usuarioController.listaUsuario);
enrutador.get('/usuario/:id', auth, usuarioController.verUsuario);
enrutador.post('/agregarUsuario', usuarioController.agregarUsuario);
enrutador.put('/updateUsuario/:id', auth, usuarioController.actualizarUsuario);
enrutador.delete('/borrarUsuario/:id', auth, usuarioController.borrarUsuario);
enrutador.post('/subirImagenUsuario/:id', [auth, multiPartyMiddleware], usuarioController.subirImagenUsuario);
enrutador.get('/verImagenUsuario/:imagen', usuarioController.verImagenUsuario);
enrutador.post('/loginUsuario', usuarioController.loginUsuario);

module.exports = enrutador;