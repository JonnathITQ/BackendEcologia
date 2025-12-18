'use strict'
var Admin = require('../models/adminModel');
var path = require('path');
var fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var controller = {

    listaAdmin: function (req, res) {
        Admin.find({}).sort().exec()
            .then(administrador => {
                if (!administrador)
                    return res.status(404).send({ message: "No se encontraron administradores" });
                return res.status(200).send({ administrador })
            })
            .catch(err => {
                return res.status(500).send({ message: "error al obtener los datos", error: err });
            });
    },

    verAdmin: function (req, res) {
        var adminId = req.params.id;

        Admin.findById(adminId)
            .then(administrador => {
                if (!administrador) return res.status(404).send({ message: 'El administrador con esta ID no existe' });
                return res.status(200).send({ administrador })
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El id no es válido' });
                }
                return res.status(500).send({ message: 'Error al recuperar los datos', error: err });
            });
    },

    agregarAdmin: async function (req, res) {
        var administrador = new Admin;
        var params = req.body;

        administrador.nombre = params.nombre;
        administrador.apellido = params.apellido;
        administrador.cedula = params.cedula;
        administrador.correo = params.correo;
        if (params.contrasenia) {
            administrador.contrasenia = await bcrypt.hash(params.contrasenia, 10)
        }
        administrador.seguroMedico = params.seguroMedico;
        administrador.tipoSangre = params.tipoSangre;
        administrador.sucursal = params.sucursal;
        administrador.imagen = null;

        administrador.save()
            .then(adminGuardado => {
                if (!adminGuardado) return res.status(404).send({ message: 'No se pudo guardar al admin, 404' })
                return res.status(200).send({ administrador: adminGuardado });
            })
            .catch(err => {
                return res.status(500).send({ message: 'error al guardar', error: err });
            });
    },

    actualizarAdmin: function (req, res) {
        var adminId = req.params.id;
        var actualizar = req.body;

        Admin.findByIdAndUpdate(adminId, actualizar, { new: true })
            .then(adminActualizado => {
                if (!adminActualizado)
                    return res.status(404).send({ message: 'No se puede actualizar el admin porque no existe' });
                return res.status(200).send({ admin: adminActualizado });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    borrarAdmin: function (req, res) {
        var adminId = req.params.id;

        Admin.findByIdAndDelete(adminId)
            .then(adminBorrado => {
                if (!adminBorrado)
                    return res.status(400).send({ message: 'No existe el admin, no se puede borrar' });
                return res.status(200).send({ admin: adminBorrado, message: 'Administrador eliminado correctamente' });
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    return res.status(404).send({ message: 'El ID no es válido o está incorrecto' });
                }
                return res.status(500).send({ message: 'Error al recuperar datos', error: err });
            });
    },

    subirImagenAdmin: function (req, res) {
        var adminId = req.params.id;
        var fileName = 'Imagen no cargada'

        if (req.files) {
            var filePath = req.files.imagen.path;
            var file_split = filePath.split(/[\\/]/);
            var fileName = file_split[file_split.length - 1];

            var extSplit = fileName.split('\.');
            var fileExt = extSplit[extSplit.length - 1];

            if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
                Admin.findByIdAndUpdate(adminId, { imagen: fileName }, { new: true })
                    .then(adminActualizado => {
                        if (!adminActualizado) {
                            fs.unlink(filePath, (unlinkErr) => {
                                return res.status(404).send({ message: 'El admin no existe, no se subió la imagen' })
                            });
                        } else {
                            return res.status(200).send({ admin: adminActualizado });
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

    verImagenAdmin: function (req, res) {
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

    loginAdmin: async function (req, res) {
        const { correo, contrasenia } = req.body;

        try {
            const admin = await Admin.findOne({ correo });
            if (!admin) {
                return res.status(400).send({ message: "Correo sin registrar" });
            }

            const contraseniaCorrecta = await bcrypt.compare(contrasenia, admin.contrasenia);

            if (!contraseniaCorrecta) {
                return res.status(400).send({ message: "Contraseña Incorrecta" });
            }

            const token = jwt.sign(
                {
                    id: admin._id,
                    correo: admin.correo,
                    role: 'admin'
                },
                "adriel",
                { expiresIn: "4h" }
            );

            return res.status(200).send({
                message: "Login exitoso",
                token,
                admin: { ...admin._doc, role: 'admin' }
            });

        } catch (error) {
            console.error("ERROR LOGIN:", error);
            return res.status(500).send({ message: "Error en login", error });
        }

    },
}

module.exports = controller;