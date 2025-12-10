'use strict'

var mongoose = require('mongoose');
var port = '3600';

mongoose.promise = global.Promise;
var app = require('./app');

mongoose.connect('mongodb+srv://adrielprogramacion:adriel@proyectos.wgiooun.mongodb.net/ArteRecicla').then(() => {
    console.log('Base de datos encontrada en MONGODB ATLAS')
    app.listen(port, () => {
        console.log('BDD conectada de manera correcta')
    })
})