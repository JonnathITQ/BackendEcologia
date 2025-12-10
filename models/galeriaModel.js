'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GaleriaSchema = Schema({
    nombreObra: String,
    artista: String,
    descripcion: String,
    materiales: String,
    tecnica: String,
    impactoAmbiental: String,
    link: String,
    imagen: String
})

module.exports = mongoose.model('Galeria', GaleriaSchema, 'galeria');