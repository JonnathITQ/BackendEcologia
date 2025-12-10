'use strict'
var Documentos = require('../models/documentosModel');
var path = require('path');
var fs = require('fs');

var controller = {

    listaDocumentos: function (req, res) {
        Documentos.find({}).sort().exec()
            .then(documentos => {
                if (!documentos)
                    return res.status(404).send({ message: "No se encontraron documentos" });
                return res.status(200).send({ documentos })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verDocumento: function (req, res) {
        var documentoId = req.params.id;

        Documentos.findById(documentoId)
            .then(documento => {
                if (!documento) return res.status(404).send({ message: 'El documento con esta ID no existe' });
                return res.status(200).send({ documento })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    guardarDocumento: function (req, res) {
        var documento = new Documentos;
        var params = req.body;

        documento.titulo = params.titulo;
        documento.descripcion = params.descripcion;
        documento.linkArticulo = null;

        documento.save()
            .then(documentoGuardado => {
                if (!documentoGuardado) return res.status(404).send({ message: 'No se pudo guardar el documento, 404' })
                return res.status(200).send({ documento: documentoGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarDocumento: function (req, res) {
        var documentoId = req.params.id;
        var actualizar = req.body;

        Documentos.findByIdAndUpdate(documentoId, actualizar, { new: true })
            .then(documentoActualizado => {
                if (!documentoActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el documento porque no existe' });
                return res.status(200).send({ documento: documentoActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    eliminarDocumento: function (req, res) {
        var documentoId = req.params.id;

        Documentos.findByIdAndDelete(documentoId)
            .then(documentoBorrado => {
                if (!documentoBorrado)
                    return res.status(400).send({ message: 'No existe el documento, no se puede borrar' });
                return res.status(200).send({ documento: documentoBorrado, message: 'Documento eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirDocumento: function (req, res) {
        var documentoId = req.params.id;
        var fileName = 'Documento no cargado'

        if (req.files) {
            var filePath = req.files.documento.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'pdf' || fileExt == 'doc' || fileExt == 'docx') {
                Documentos.findByIdAndUpdate(documentoId, { linkArticulo: fileName }, { new: true })
                    .then(documentoActualizado => {
                        if (!documentoActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El documento no existe, no se subió el archivo' })
                            });
                        } else {
                            return res.status(200).send({ documento: documentoActualizado });
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
            return res.status(400).send({ message: 'No se subió ningún documento' })
        }
    },

    verDocumentoFile: function (req, res) {
        var file = req.params.documento;
        var path_file = path.join(__dirname, '../resources', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'El documento no existe' });
            }
        });
    }
}

module.exports = controller;
