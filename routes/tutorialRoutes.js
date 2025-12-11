'use strict'
'use strict'

var express = require('express');
var tutorialController = require('../controllers/tutorialController');

var enrutador = express.Router();

var multiparty = require('connect-multiparty');
var multiPartyMiddleware = multiparty({ uploadDir: './vid' });

var auth = require('../middlewares/auth');

enrutador.get('/listaTutorial', tutorialController.listaTutorial);
enrutador.get('/tutorial/:id', tutorialController.verTutorial);
enrutador.post('/agregarTutorial', tutorialController.agregarTutorial);
enrutador.put('/updateTutorial/:id', tutorialController.actualizarTutorial);
enrutador.delete('/borrarTutorial/:id', tutorialController.borrarTutorial);
enrutador.post('/subirVideoTutorial/:id', multiPartyMiddleware, tutorialController.subirVideoTutorial);
enrutador.get('/verVideoTutorial/:video', tutorialController.verVideoTutorial);


module.exports = enrutador;