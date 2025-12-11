'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var adminRoutes = require('./routes/adminRoutes');
var consejosRoutes = require('./routes/consejosRoutes');
var documentosRoutes = require('./routes/documentosRoutes');
var foroRoutes = require('./routes/foroRoutes');
var galeriaRoutes = require('./routes/galeriaRoutes');
var moderadorRoutes = require('./routes/moderadorRoutes');
var tutorialRoutes = require('./routes/tutorialRoutes');
var usuarioRoutes = require('./routes/usuarioRoutes');
var comentariosRoutes = require('./routes/comentariosRoutes');
var cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//4) Usamos el app.use((req, res, next)=> { }) para manejar los headers de las peticiones
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

app.use('/', adminRoutes);
app.use('/', consejosRoutes);
app.use('/', documentosRoutes);
app.use('/', foroRoutes);
app.use('/', galeriaRoutes);
app.use('/', moderadorRoutes);
app.use('/', tutorialRoutes);
app.use('/', usuarioRoutes);
app.use('/', comentariosRoutes);

module.exports = app;
