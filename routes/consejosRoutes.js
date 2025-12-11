'use strict'

var express = require('express');
var consejosController = require('../controllers/consejosController');

var enrutador = express.Router();

var auth = require('../middlewares/auth');

enrutador.get('/listaConsejos', consejosController.listaConsejos);
enrutador.post('/guardarConsejo', consejosController.guardarConsejo);
enrutador.put('/updateConsejo/:id', consejosController.actualizarConsejo);
enrutador.delete('/borrarConsejo/:id', consejosController.borrarConsejo);

module.exports = enrutador;