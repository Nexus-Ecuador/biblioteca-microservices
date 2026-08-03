const prisma = require("../config/prisma");

// =======================================================
// OBTENER TODOS LOS LIBROS
// =======================================================
exports.getBooks = async (req, res) => {
    try {

        const libros = await prisma.libro.findMany({
            orderBy: {
                id: "asc"
            }
        });

        res.json(libros);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }
};

// =======================================================
// OBTENER LIBRO POR ID
// =======================================================
exports.getBookById = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                error: "ID inválido"
            });

        }

        const libro = await prisma.libro.findUnique({

            where: {
                id
            }

        });

        if (!libro) {

            return res.status(404).json({
                error: "Libro no encontrado"
            });

        }

        res.json(libro);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

};

// =======================================================
// CREAR LIBRO
// =======================================================
exports.createBook = async (req, res) => {

    try {

        const {
            titulo,
            autor,
            isbn,
            categoria,
            disponible
        } = req.body;

        if (!titulo || !autor) {

            return res.status(400).json({
                error: "Título y autor son obligatorios"
            });

        }

        const libro = await prisma.libro.create({

            data: {

                titulo,
                autor,

                isbn: isbn || null,

                categoria: categoria || null,

                disponible:
                    disponible === undefined
                        ? true
                        : disponible

            }

        });

        res.status(201).json({

            mensaje: "Libro creado correctamente",

            libro

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

};

// =======================================================
// ACTUALIZAR LIBRO
// =======================================================
exports.updateBook = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                error: "ID inválido"
            });

        }

        const libro = await prisma.libro.update({

            where: {
                id
            },

            data: req.body

        });

        res.json({

            mensaje: "Libro actualizado correctamente",

            libro

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

};

// =======================================================
// ELIMINAR LIBRO
// =======================================================
exports.deleteBook = async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (isNaN(id)) {

            return res.status(400).json({
                error: "ID inválido"
            });

        }

        await prisma.libro.delete({

            where: {
                id
            }

        });

        res.json({

            mensaje: "Libro eliminado correctamente"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error: error.message

        });

    }

};