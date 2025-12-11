'use strict'
var Usuario = require('../models/usuarioModel');
var path = require('path');
var fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var controller = {

    listaUsuario: function (req, res) {
        Usuario.find({}).sort().exec()
            .then(usuarios => {
                if (!usuarios)
                    return res.status(404).send({ message: "No se encontraron usuarios" });
                return res.status(200).send({ usuarios })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verUsuario: function (req, res) {
        var usuarioId = req.params.id;

        Usuario.findById(usuarioId)
            .then(usuario => {
                if (!usuario) return res.status(404).send({ message: 'El usuario con esta ID no existe' });
                return res.status(200).send({ usuario })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    agregarUsuario: async function (req, res) {
        var usuario = new Usuario;
        var params = req.body;

        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.descripcion = params.descripcion;
        usuario.correo = params.correo;
        if (params.contrasenia) {
            usuario.contrasenia = await bcrypt.hash(params.contrasenia, 10)
        }
        usuario.imagen = null;

        usuario.save()
            .then(usuarioGuardado => {
                if (!usuarioGuardado) return res.status(404).send({ message: 'No se pudo guardar al usuario, 404' })
                return res.status(200).send({ usuario: usuarioGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarUsuario: async function (req, res) {
        var usuarioId = req.params.id;
        var actualizar = req.body;

        if (actualizar.contrasenia) {
            actualizar.contrasenia = await bcrypt.hash(actualizar.contrasenia, 10);
        }

        Usuario.findByIdAndUpdate(usuarioId, actualizar, { new: true })
            .then(usuarioActualizado => {
                if (!usuarioActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el usuario porque no existe' });
                return res.status(200).send({ usuario: usuarioActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarUsuario: function (req, res) {
        var usuarioId = req.params.id;

        Usuario.findByIdAndDelete(usuarioId)
            .then(usuarioBorrado => {
                if (!usuarioBorrado)
                    return res.status(400).send({ message: 'No existe el usuario, no se puede borrar' });
                return res.status(200).send({ usuario: usuarioBorrado, message: 'Usuario eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirImagenUsuario: function (req, res) {
        var usuarioId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            console.log("Subiendo imagen:", req.files);
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1].toLowerCase();

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Usuario.findByIdAndUpdate(usuarioId, { imagen: fileName }, { new: true })
                    .then(usuarioActualizado => {
                        if (!usuarioActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El usuario no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ usuario: usuarioActualizado });
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

    verImagenUsuario: function (req, res) {
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

    loginUsuario: async function (req, res) {
        const { correo, contrasenia } = req.body;

        try {
            const usuario = await Usuario.findOne({ correo });
            if (!usuario) {
                return res.status(400).send({ message: "Correo sin registrar" });
            }

            const contraseniaCorrecta = await bcrypt.compare(contrasenia, usuario.contrasenia);

            if (!contraseniaCorrecta) {
                return res.status(400).send({ message: "Contraseña Incorrecta" });
            }

            const token = jwt.sign(
                {
                    id: usuario._id,
                    correo: usuario.correo,
                },
                "adriel",
                { expiresIn: "4h" }
            );

            console.log('Enviando respuesta login:', { message: "Login exitoso", token, usuario });
            return res.status(200).send({
                message: "Login exitoso",
                token,
                usuario
            });

        } catch (error) {
            console.error("ERROR LOGIN:", error);
            return res.status(500).send({ message: "Error en login", error });
        }

    },

    getUserIdByEmail: function (req, res) {
        var correo = req.body.correo;
        Usuario.findOne({ correo: correo })
            .then(usuario => {
                if (!usuario) return res.status(404).send({ message: 'El usuario no existe' });
                return res.status(200).send({ userId: usuario._id });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al buscar usuario', error: err });
            });
    },

    resetPassword: async function (req, res) {
        var usuarioId = req.params.id;
        var params = req.body;

        if (params.contrasenia) {
            params.contrasenia = await bcrypt.hash(params.contrasenia, 10);

            Usuario.findByIdAndUpdate(usuarioId, { contrasenia: params.contrasenia }, { new: true })
                .then(usuarioActualizado => {
                    if (!usuarioActualizado) return res.status(404).send({ message: 'Usuario no encontrado' });
                    return res.status(200).send({ message: 'Contraseña actualizada', usuario: usuarioActualizado });
                })
                .catch(err => {
                    return res.status(500).send({ message: 'Error al actualizar', error: err });
                });
        } else {
            return res.status(400).send({ message: 'Falta la contraseña' });
        }
    }
}

module.exports = controller;
