'use strict'

var express = require('express');
var documentosController = require('../controllers/documentosController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './resources' });

var auth = require('../middlewares/auth');

enrutador.get('/listaDoc', documentosController.listaDocumentos);
enrutador.get('/documento/:id', documentosController.verDocumento);
enrutador.post('/guardarDoc', auth, documentosController.guardarDocumento);
enrutador.put('/updateDoc/:id', auth, documentosController.actualizarDocumento);
enrutador.delete('/eliminarDoc/:id', auth, documentosController.eliminarDocumento);
enrutador.post('/subirDocumento/:id', [auth, multiPartyMiddleware], documentosController.subirDocumento);
enrutador.get('/verDocumento/:documento', documentosController.verDocumentoFile);

module.exports = enrutador;
