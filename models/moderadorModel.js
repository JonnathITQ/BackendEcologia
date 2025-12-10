'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ModeradorSchema = Schema({
    nombre: String,
    apellido: String,
    cedula: Number,
    seguroMedico: Boolean,
    tipoSangre: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',] },
    imagen: String
})

module.exports = mongoose.model('Moderador', ModeradorSchema, 'moderador');