'use strict'
var Consejos = require('../models/consejosModel');

var controller = {

    listaConsejos: function (req, res) {
        Consejos.find({}).sort().exec()
            .then(consejos => {
                if (!consejos)
                    return res.status(404).send({ message: "No se encontraron consejos" });
                return res.status(200).send({ consejos })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    guardarConsejo: function (req, res) {
        var consejo = new Consejos;
        var params = req.body;

        consejo.nombreConsejo = params.nombreConsejo;
        consejo.mensaje = params.mensaje;

        consejo.save()
            .then(consejoGuardado => {
                if (!consejoGuardado) return res.status(404).send({ message: 'No se pudo guardar el consejo, 404' })
                return res.status(200).send({ consejo: consejoGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarConsejo: function (req, res) {
        var consejoId = req.params.id;
        var actualizar = req.body;

        Consejos.findByIdAndUpdate(consejoId, actualizar, { new: true })
            .then(consejoActualizado => {
                if (!consejoActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el consejo porque no existe' });
                return res.status(200).send({ consejo: consejoActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarConsejo: function (req, res) {
        var consejoId = req.params.id;

        Consejos.findByIdAndDelete(consejoId)
            .then(consejoBorrado => {
                if (!consejoBorrado)
                    return res.status(400).send({ message: 'No existe el consejo, no se puede borrar' });
                return res.status(200).send({ consejo: consejoBorrado, message: 'Consejo eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    }
}

module.exports = controller;
