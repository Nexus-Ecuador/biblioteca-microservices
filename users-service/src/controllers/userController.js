const prisma = require("../config/prisma");

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {

        const usuarios = await prisma.usuario.findMany();

        res.json(usuarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const usuario = await prisma.usuario.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.json(usuario);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
};

// Crear usuario
exports.createUser = async (req, res) => {
    try {

        const { nombre, correo, cedula } = req.body;

        if (!nombre || !correo || !cedula) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios"
            });
        }

        const nuevo = await prisma.usuario.create({
            data: {
                nombre,
                correo,
                cedula
            }
        });

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: nuevo
        });

    } catch (error) {

        console.error(error);

        if (error.code === "P2002") {
            return res.status(400).json({
                error: "El correo o la cédula ya existen"
            });
        }

        res.status(500).json({
            error: error.message
        });

    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {

        const { id } = req.params;

        const existe = await prisma.usuario.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existe) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        const usuario = await prisma.usuario.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });

        res.json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const existe = await prisma.usuario.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existe) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        await prisma.usuario.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
};