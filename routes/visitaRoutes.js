'use strict'

var express = require('express');
var visitaController = require('../controllers/visitaController');

var api = express.Router();

api.post('/registrarVisita', visitaController.registrarVisita);
api.get('/obtenerVisitas', visitaController.obtenerVisitas);

module.exports = api;
