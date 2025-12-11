'use strict'

var express = require('express');
var adminController = require('../controllers/adminController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaAdmin', adminController.listaAdmin);
enrutador.get('/admin/:id', adminController.verAdmin);
enrutador.post('/agregarAdmin', adminController.agregarAdmin);
enrutador.put('/updateAdmin/:id', adminController.actualizarAdmin);
enrutador.delete('/borrarAdmin/:id', adminController.borrarAdmin);
enrutador.post('/subirImagenAdmin/:id', multiPartyMiddleware, adminController.subirImagenAdmin);
enrutador.get('/verImagenAdmin/:imagen', multiPartyMiddleware, adminController.verImagenAdmin);
enrutador.post('/loginAdmin', adminController.loginAdmin);

module.exports = enrutador;