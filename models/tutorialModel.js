'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TutorialSchema = Schema({
    nombre: String,
    video: String,
    descripcion: String
})

module.exports = mongoose.model('Tutorial', TutorialSchema, 'tutoriales');