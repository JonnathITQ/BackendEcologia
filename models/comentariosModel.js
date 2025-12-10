'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComentariosSchema = Schema({
    usuario_id: { type: Schema.Types.ObjectId, ref: "Usuario" },
    galeria_id: { type: Schema.Types.ObjectId, ref: "Galeria" },
    mensaje: String
})

module.exports = mongoose.model('Comentarios', ComentariosSchema, 'comentarios');