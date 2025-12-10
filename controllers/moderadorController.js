'use strict'
var Moderador = require('../models/moderadorModel');
var path = require('path');
var fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var controller = {

    listaModerador: function (req, res) {
        Moderador.find({}).sort().exec()
            .then(moderadores => {
                if (!moderadores)
                    return res.status(404).send({ message: "No se encontraron moderadores" });
                return res.status(200).send({ moderadores })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verModerador: function (req, res) {
        var moderadorId = req.params.id;

        Moderador.findById(moderadorId)
            .then(moderador => {
                if (!moderador) return res.status(404).send({ message: 'El moderador con esta ID no existe' });
                return res.status(200).send({ moderador })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    agregarModerador: async function (req, res) {
        var moderador = new Moderador;
        var params = req.body;

        moderador.nombre = params.nombre;
        moderador.apellido = params.apellido;
        moderador.cedula = params.cedula;
        moderador.correo = params.correo;
        if (params.contrasenia) {
            moderador.contrasenia = await bcrypt.hash(params.contrasenia, 10)
        }
        moderador.seguroMedico = params.seguroMedico;
        moderador.tipoSangre = params.tipoSangre;
        moderador.imagen = null;

        moderador.save()
            .then(moderadorGuardado => {
                if (!moderadorGuardado) return res.status(404).send({ message: 'No se pudo guardar al moderador, 404' })
                return res.status(200).send({ moderador: moderadorGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarModerador: async function (req, res) {
        var moderadorId = req.params.id;
        var actualizar = req.body;

        if (actualizar.contrasenia) {
            actualizar.contrasenia = await bcrypt.hash(actualizar.contrasenia, 10);
        }

        Moderador.findByIdAndUpdate(moderadorId, actualizar, { new: true })
            .then(moderadorActualizado => {
                if (!moderadorActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el moderador porque no existe' });
                return res.status(200).send({ moderador: moderadorActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarModerador: function (req, res) {
        var moderadorId = req.params.id;

        Moderador.findByIdAndDelete(moderadorId)
            .then(moderadorBorrado => {
                if (!moderadorBorrado)
                    return res.status(400).send({ message: 'No existe el moderador, no se puede borrar' });
                return res.status(200).send({ moderador: moderadorBorrado, message: 'Moderador eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirImagenModerador: function (req, res) {
        var moderadorId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Moderador.findByIdAndUpdate(moderadorId, { imagen: fileName }, { new: true })
                    .then(moderadorActualizado => {
                        if (!moderadorActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El moderador no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ moderador: moderadorActualizado });
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

    verImagenModerador: function (req, res) {
        var file = req.params.imagen;
        var path_file = path.join(__dirname, '../uploads', file);

        fs.stat(path_file, function (err, stats) {
            if (!err && stats.isFile()) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({ message: 'La imagen no existe' });
            }
        });
    },

    loginModerador: async function (req, res) {
        const { correo, contrasenia } = req.body;

        try {
            const moderador = await Moderador.findOne({ correo });
            if (!moderador) {
                return res.status(400).send({ message: "Correo sin registrar" });
            }

            const contraseniaCorrecta = await bcrypt.compare(contrasenia, moderador.contrasenia);

            if (!contraseniaCorrecta) {
                return res.status(400).send({ message: "Contraseña Incorrecta" });
            }

            const token = jwt.sign(
                {
                    id: moderador._id,
                    correo: moderador.correo,
                },
                "adriel",
                { expiresIn: "4h" }
            );

            return res.status(200).send({
                message: "Login exitoso",
                token,
                moderador
            });

        } catch (error) {
            console.error("ERROR LOGIN:", error);
            return res.status(500).send({ message: "Error en login", error });
        }
    }
}

module.exports = controller;
