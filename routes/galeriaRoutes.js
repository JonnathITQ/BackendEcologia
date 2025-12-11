'use strict'
'use strict'

var express = require('express');
var galeriaController = require('../controllers/galeriaController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });



enrutador.get('/listagaleria', galeriaController.listaGaleria);
enrutador.get('/galeria/:id', galeriaController.verObra);
enrutador.post('/guardarGaleria', galeriaController.guardarGaleria);
enrutador.put('/updateGaleria/:id', galeriaController.actualizarGaleria);
enrutador.delete('/eliminarGaleria/:id', galeriaController.eliminarGaleria);
enrutador.post('/subirImagenGaleria/:id', multiPartyMiddleware, galeriaController.subirImagenGaleria);
enrutador.get('/verImagenGaleria/:imagen', multiPartyMiddleware, galeriaController.verImagenGaleria);

module.exports = enrutador