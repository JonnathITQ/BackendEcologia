'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitaSchema = Schema({
    fecha: { type: Date, default: Date.now },
    tipo: { type: String, default: 'share' }
});

module.exports = mongoose.model('Visita', VisitaSchema);
