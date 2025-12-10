'use strict'
'use strict'

var express = require('express');
var galeriaController = require('../controllers/galeriaController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listagaleria', galeriaController.listaGaleria);
enrutador.get('/galeria/:id', galeriaController.verObra);
enrutador.post('/guardarGaleria', auth, galeriaController.guardarGaleria);
enrutador.put('/updateGaleria/:id', auth, galeriaController.actualizarGaleria);
enrutador.delete('/eliminarGaleria/:id', auth, galeriaController.eliminarGaleria);
enrutador.post('/subirImagenGaleria/:id', [auth, multiPartyMiddleware], galeriaController.subirImagenGaleria);
enrutador.get('/verImagenGaleria/:imagen', galeriaController.verImagenGaleria);

module.exports = enrutador