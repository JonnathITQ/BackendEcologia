'use strict'

var express = require('express');
var consejosController = require('../controllers/consejosController');

var enrutador = express.Router();

var auth = require('../middlewares/auth');

enrutador.get('/listaConsejos', consejosController.listaConsejos);
enrutador.post('/guardarConsejo', auth, consejosController.guardarConsejo);
enrutador.put('/updateConsejo/:id', auth, consejosController.actualizarConsejo);
enrutador.delete('/borrarConsejo/:id', auth, consejosController.borrarConsejo);

module.exports = enrutador;