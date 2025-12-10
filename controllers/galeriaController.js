'use strict'
var Galeria = require('../models/galeriaModel');
var path = require('path');
var fs = require('fs');

var controller = {

    listaGaleria: function (req, res) {
        Galeria.find({}).sort().exec()
            .then(galeria => {
                if (!galeria)
                    return res.status(404).send({ message: "No se encontraron obras en la galería" });
                return res.status(200).send({ galeria })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verObra: function (req, res) {
        var obraId = req.params.id;

        Galeria.findById(obraId)
            .then(obra => {
                if (!obra) return res.status(404).send({ message: 'La obra con esta ID no existe' });
                return res.status(200).send({ obra })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    guardarGaleria: function (req, res) {
        var galeria = new Galeria;
        var params = req.body;

        galeria.nombreObra = params.nombreObra;
        galeria.artista = params.artista;
        galeria.descripcion = params.descripcion;
        galeria.materiales = params.materiales;
        galeria.tecnica = params.tecnica;
        galeria.impactoAmbiental = params.impactoAmbiental;
        galeria.link = params.link;
        galeria.imagen = null;

        galeria.save()
            .then(galeriaGuardada => {
                if (!galeriaGuardada) return res.status(404).send({ message: 'No se pudo guardar la obra, 404' })
                return res.status(200).send({ galeria: galeriaGuardada });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarGaleria: function (req, res) {
        var obraId = req.params.id;
        var actualizar = req.body;

        Galeria.findByIdAndUpdate(obraId, actualizar, { new: true })
            .then(obraActualizada => {
                if (!obraActualizada)
                    return res.status(404).send({ message: 'No se puede actualizar la obra porque no existe' });
                return res.status(200).send({ galeria: obraActualizada });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    eliminarGaleria: function (req, res) {
        var obraId = req.params.id;

        Galeria.findByIdAndDelete(obraId)
            .then(obraBorrada => {
                if (!obraBorrada)
                    return res.status(400).send({ message: 'No existe la obra, no se puede borrar' });
                return res.status(200).send({ galeria: obraBorrada, message: 'Obra eliminada correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirImagenGaleria: function (req, res) {
        var obraId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Galeria.findByIdAndUpdate(obraId, { imagen: fileName }, { new: true })
                    .then(obraActualizada => {
                        if (!obraActualizada) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'La obra no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ galeria: obraActualizada });
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

    verImagenGaleria: function (req, res) {
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
