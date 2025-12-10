'use strict'

var express = require('express');
var adminController = require('../controllers/adminController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './uploads' });

var auth = require('../middlewares/auth');

enrutador.get('/listaAdmin', auth, adminController.listaAdmin);
enrutador.get('/admin/:id', auth, adminController.verAdmin);
enrutador.post('/agregarAdmin', auth, adminController.agregarAdmin);
enrutador.put('/updateAdmin/:id', auth, adminController.actualizarAdmin);
enrutador.delete('/borrarAdmin/:id', auth, adminController.borrarAdmin);
enrutador.post('/subirImagenAdmin/:id', [auth, multiPartyMiddleware], adminController.subirImagenAdmin);
enrutador.get('/verImagenAdmin/:imagen', adminController.verImagenAdmin);
enrutador.post('/loginAdmin', adminController.loginAdmin);

module.exports = enrutador;