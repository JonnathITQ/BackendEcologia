'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    descripcion: String,
    correo: String,
    contrasenia: String,
    imagen: String
})

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');