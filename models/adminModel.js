'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AdminSchema = Schema({
    nombre: String,
    apellido: String,
    cedula: Number,
    correo: String,
    contrasenia: String,
    seguroMedico: Boolean,
    tipoSangre: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',] },
    sucursal: String,
    imagen: String
})

module.exports = mongoose.model('Administrador', AdminSchema, 'administrador');