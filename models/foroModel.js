'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ForoSchema = Schema({
    usuario_id: { type: Schema.Types.ObjectId, ref: "Usuario" },
    nombreObra: String,
    descripcion: String,
    imagen: String
})

module.exports = mongoose.model('Foro', ForoSchema, 'foroPersonas');