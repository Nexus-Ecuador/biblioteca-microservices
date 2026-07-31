const axios = require("axios");
const prisma = require("../config/prisma");
require("dotenv").config();

// Obtener todos los préstamos
exports.getLoans = async (req, res) => {
    try {
        const loans = await prisma.prestamo.findMany();

        res.json(loans);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Obtener un préstamo por ID
exports.getLoanById = async (req, res) => {
    try {
        const { id } = req.params;

        const loan = await prisma.prestamo.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!loan) {
            return res.status(404).json({
                error: "Préstamo no encontrado"
            });
        }

        res.json(loan);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// Crear préstamo
exports.createLoan = async (req, res) => {

    try {

        const { usuarioId, libroId } = req.body;

        if (!usuarioId || !libroId) {
            return res.status(400).json({
                error: "usuarioId y libroId son obligatorios"
            });
        }

        // Verificar usuario
        const usuario = await axios.get(
    `${process.env.USER_SERVICE}/api/users/${usuarioId}`
        );

        // Verificar libro
        const libroResponse = await axios.get(
    `${process.env.BOOK_SERVICE}/api/books/${libroId}`
        );

        const libro = libroResponse.data;

        // Verificar disponibilidad
        if (!libro.disponible) {
            return res.status(400).json({
                error: "El libro ya está prestado"
            });
        }

        // Registrar préstamo
        const prestamo = await prisma.prestamo.create({
            data: {
                usuarioId,
                libroId
            }
        });

        // Marcar libro como no disponible
        await axios.put(
    `${process.env.BOOK_SERVICE}/api/books/${libroId}`,
            {
                disponible: false
            }
        );

        res.status(201).json({
            mensaje: "Préstamo realizado correctamente",
            prestamo
        });

    } catch (error) {

        res.status(500).json({
            error: error.response?.data || error.message
        });

    }

};

// Actualizar préstamo
// Devolver préstamo
exports.updateLoan = async (req, res) => {

    try {

        const { id } = req.params;

        // Buscar préstamo
        const prestamo = await prisma.prestamo.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!prestamo) {

            return res.status(404).json({
                error: "Préstamo no encontrado"
            });

        }

        // Actualizar préstamo
        const actualizado = await prisma.prestamo.update({

            where: {
                id: Number(id)
            },

            data: {

                estado: "DEVUELTO",
                fechaDevolucion: new Date()

            }

        });

        // Liberar libro
        await axios.put(

            `http://localhost:3002/api/books/${prestamo.libroId}`,

            {
                disponible: true
            }

        );

        res.json({

            mensaje: "Libro devuelto correctamente",
            prestamo: actualizado

        });

    } catch (error) {

        res.status(500).json({

            error: error.response?.data || error.message

        });

    }

};
// Eliminar préstamo
exports.deleteLoan = async (req, res) => {

    try {

        const { id } = req.params;

        await prisma.prestamo.delete({

            where: {
                id: Number(id)
            }

        });

        res.json({
            mensaje: "Préstamo eliminado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};