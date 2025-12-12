'use strict'

var Visita = require('../models/visitaModel');

function registrarVisita(req, res) {
    var visita = new Visita();
    visita.tipo = 'share';

    visita.save().then((visitaStored) => {
        if (!visitaStored) return res.status(404).send({ message: 'No se ha podido registrar la visita' });
        return res.status(200).send({ visita: visitaStored });
    }).catch((err) => {
        return res.status(500).send({ message: 'Error al guardar la visita' });
    });
}

function obtenerVisitas(req, res) {
    Visita.find({ tipo: 'share' }).sort('fecha').then((visitas) => {
        if (!visitas) return res.status(404).send({ message: 'No hay visitas registradas' });
        return res.status(200).send({ visitas: visitas });
    }).catch((err) => {
        return res.status(500).send({ message: 'Error al obtener las visitas' });
    });
}

module.exports = {
    registrarVisita,
    obtenerVisitas
}
