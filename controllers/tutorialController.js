'use strict'
var Tutorial = require('../models/tutorialModel');
var path = require('path');
var fs = require('fs');

var controller = {

    listaTutorial: function (req, res) {
        Tutorial.find({}).sort().exec()
            .then(tutoriales => {
                if (!tutoriales)
                    return res.status(404).send({ message: "No se encontraron tutoriales" });
                return res.status(200).send({ tutoriales })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verTutorial: function (req, res) {
        var tutorialId = req.params.id;

        Tutorial.findById(tutorialId)
            .then(tutorial => {
                if (!tutorial) return res.status(404).send({ message: 'El tutorial con esta ID no existe' });
                return res.status(200).send({ tutorial })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    agregarTutorial: function (req, res) {
        var tutorial = new Tutorial;
        var params = req.body;

        tutorial.nombre = params.nombre;
        tutorial.descripcion = params.descripcion;
        tutorial.video = null;

        tutorial.save()
            .then(tutorialGuardado => {
                if (!tutorialGuardado) return res.status(404).send({ message: 'No se pudo guardar el tutorial, 404' })
                return res.status(200).send({ tutorial: tutorialGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarTutorial: function (req, res) {
        var tutorialId = req.params.id;
        var actualizar = req.body;

        Tutorial.findByIdAndUpdate(tutorialId, actualizar, { new: true })
            .then(tutorialActualizado => {
                if (!tutorialActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el tutorial porque no existe' });
                return res.status(200).send({ tutorial: tutorialActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarTutorial: function (req, res) {
        var tutorialId = req.params.id;

        Tutorial.findByIdAndDelete(tutorialId)
            .then(tutorialBorrado => {
                if (!tutorialBorrado)
                    return res.status(400).send({ message: 'No existe el tutorial, no se puede borrar' });
                return res.status(200).send({ tutorial: tutorialBorrado, message: 'Tutorial eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirVideoTutorial: function (req, res) {
        var tutorialId = req.params.id;
        var fileName = 'Video no cargado'

        if (req.files) {
            var filePath = req.files.video.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'mp4' || fileExt == 'avi' || fileExt == 'mkv' || fileExt == 'mov') {
                Tutorial.findByIdAndUpdate(tutorialId, { video: fileName }, { new: true })
                    .then(tutorialActualizado => {
                        if (!tutorialActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El tutorial no existe, no se subió el video' })
                            });
                        } else {
                            return res.status(200).send({ tutorial: tutorialActualizado });
                        }
                    })
                    .catch(err => {
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error al eliminar el archivo temporal', unlinkErr);
                            if (err.name === 'CastError') {
                                return res.status(404).send({ message: 'El Id no es válido' })
                            }
                            return res.status(500).send({ message: 'Error al recuperar datos', error: err });
                        });
                    });
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar el archivo con ext no válida', err)
                    return res.status(200).send({ message: "La extensión no es válida, archivo eliminado" });
                });
            }
        } else {
            return res.status(400).send({ message: 'No se subió ningún video' })
        }
    },

    verVideoTutorial: function (req, res) {
        var file = req.params.video;
        var path_file = path.join(__dirname, '../vid', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'El video no existe' });
            }
        });
    }
}

module.exports = controller;
