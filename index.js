'use strict'
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3600;
const MONGO_URI = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado correctamente');
        app.listen(PORT, () => {
            console.log('Servidor corriendo en puerto', PORT);
        });
    })
    .catch(err => {
        console.error('Error al conectar MongoDB:', err);
    });
