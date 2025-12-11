'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ConsejosSchema = Schema({
    nombreConsejo: String,
    mensaje: String
})

module.exports = mongoose.model('Consejos', ConsejosSchema, 'consejos');