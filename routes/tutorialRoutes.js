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
enrutador.post('/agregarTutorial', auth, tutorialController.agregarTutorial);
enrutador.put('/updateTutorial/:id', auth, tutorialController.actualizarTutorial);
enrutador.delete('/borrarTutorial/:id', auth, tutorialController.borrarTutorial);
enrutador.post('/subirVideoTutorial/:id', [auth, multiPartyMiddleware], tutorialController.subirVideoTutorial);
enrutador.get('/verVideoTutorial/:video', tutorialController.verVideoTutorial);


module.exports = enrutador;