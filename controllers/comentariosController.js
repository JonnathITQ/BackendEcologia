'use strict'
var Comentarios = require('../models/comentariosModel');

var controller = {

    listaComentarios: function (req, res) {
        Comentarios.find({}).sort().populate('usuario_id').populate('galeria_id').populate('foro_id').exec()
            .then(comentarios => {
                if (!comentarios)
                    return res.status(404).send({ message: "No se encontraron comentarios" });
                return res.status(200).send({ comentarios })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    guardarComentarios: function (req, res) {
        var comentario = new Comentarios;
        var params = req.body;

        comentario.usuario_id = params.usuario_id;
        comentario.galeria_id = params.galeria_id;
        comentario.foro_id = params.foro_id;
        comentario.mensaje = params.mensaje;

        comentario.save()
            .then(comentarioGuardado => {
                if (!comentarioGuardado) return res.status(404).send({ message: 'No se pudo guardar el comentario, 404' })
                return res.status(200).send({ comentario: comentarioGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarComentarios: function (req, res) {
        var comentarioId = req.params.id;
        var actualizar = req.body;

        Comentarios.findByIdAndUpdate(comentarioId, actualizar, { new: true })
            .then(comentarioActualizado => {
                if (!comentarioActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el comentario porque no existe' });
                return res.status(200).send({ comentario: comentarioActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarComentarios: function (req, res) {
        var comentarioId = req.params.id;

        Comentarios.findByIdAndDelete(comentarioId)
            .then(comentarioBorrado => {
                if (!comentarioBorrado)
                    return res.status(400).send({ message: 'No existe el comentario, no se puede borrar' });
                return res.status(200).send({ comentario: comentarioBorrado, message: 'Comentario eliminado correctamente' });
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
