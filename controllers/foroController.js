'use strict'
var Foro = require('../models/foroModel');
var path = require('path');
var fs = require('fs');

var controller = {

    listaForo: function (req, res) {
        Foro.find({}).sort().populate('usuario_id').exec()
            .then(foro => {
                if (!foro)
                    return res.status(404).send({ message: "No se encontraron publicaciones en el foro" });
                return res.status(200).send({ foro })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    guardarForo: function (req, res) {
        var foro = new Foro;
        var params = req.body;

        foro.usuario_id = params.usuario_id;
        foro.nombreObra = params.nombreObra;
        foro.descripcion = params.descripcion;
        foro.pendiente = params.pendiente;
        foro.imagen = null;

        foro.save()
            .then(foroGuardado => {
                if (!foroGuardado) return res.status(404).send({ message: 'No se pudo guardar la publicación, 404' })
                return res.status(200).send({ foro: foroGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarForo: function (req, res) {
        var foroId = req.params.id;
        var actualizar = req.body;

        Foro.findByIdAndUpdate(foroId, actualizar, { new: true })
            .then(foroActualizado => {
                if (!foroActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar la publicación porque no existe' });
                return res.status(200).send({ foro: foroActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    eliminarForo: function (req, res) {
        var foroId = req.params.id;

        Foro.findByIdAndDelete(foroId)
            .then(foroBorrado => {
                if (!foroBorrado)
                    return res.status(400).send({ message: 'No existe la publicación, no se puede borrar' });
                return res.status(200).send({ foro: foroBorrado, message: 'Publicación eliminada correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirImagenForo: function (req, res) {
        var foroId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Foro.findByIdAndUpdate(foroId, { imagen: fileName }, { new: true })
                    .then(foroActualizado => {
                        if (!foroActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'La publicación no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ foro: foroActualizado });
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
            return res.status(400).send({ message: 'No se subió ninguna imagen' })
        }
    },

    verImagenForo: function (req, res) {
        var file = req.params.imagen;
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });
            }
        });
    }
}

module.exports = controller;
