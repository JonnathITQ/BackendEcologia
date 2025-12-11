'use strict'

var express = require('express');
var comentariosController = require('../controllers/comentariosController');

var enrutador = express.Router();

var auth = require('../middlewares/auth');

enrutador.get('/listaComentarios', comentariosController.listaComentarios);
enrutador.post('/guardarComentarios', comentariosController.guardarComentarios);
enrutador.put('/updateComentarios/:id', comentariosController.actualizarComentarios);
enrutador.delete('/borrarComentarios/:id', comentariosController.borrarComentarios);

module.exports = enrutador;