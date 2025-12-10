'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DocumentosSchema = Schema({
    titulo: String,
    descripcion: String,
    linkArticulo: String
})

module.exports = mongoose.model('Documentos', DocumentosSchema, 'documentos');