const axios = require("axios");
const prisma = require("../config/prisma");
require("dotenv").config();

// Obtener todos los préstamos
exports.getLoans = async (req, res) => {
    try {
        const loans = await prisma.prestamo.findMany({
            include: { usuario: true, libro: true }   // ✅ Trae nombres
        });
        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener préstamo por ID
exports.getLoanById = async (req, res) => {
    try {
        const { id } = req.params;
        const loan = await prisma.prestamo.findUnique({
            where: { id: Number(id) },
            include: { usuario: true, libro: true }
        });
        if (!loan) {
            return res.status(404).json({ error: "Préstamo no encontrado" });
        }
        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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

        const uid = Number(usuarioId);
        const lid = Number(libroId);

        // Verificar usuario
        const usuarioRes = await axios.get(
            `${process.env.USER_SERVICE}/api/users/${uid}`
        );

        // Verificar libro
        const libroRes = await axios.get(
            `${process.env.BOOK_SERVICE}/api/books/${lid}`
        );
        const libro = libroRes.data;

        if (!libro.disponible) {
            return res.status(400).json({
                error: "El libro ya está prestado"
            });
        }

        // Registrar préstamo
        const prestamo = await prisma.prestamo.create({
            data: { usuarioId: uid, libroId: lid },
            include: { usuario: true, libro: true }
        });

        // Marcar libro como no disponible
        await axios.put(
            `${process.env.BOOK_SERVICE}/api/books/${lid}`,
            { disponible: false }
        );

        res.status(201).json({
            mensaje: "Préstamo realizado correctamente",
            prestamo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.response?.data?.error || error.response?.data || error.message
        });
    }
};

// Devolver préstamo
exports.updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const prestamo = await prisma.prestamo.findUnique({
            where: { id: Number(id) }
        });

        if (!prestamo) {
            return res.status(404).json({ error: "Préstamo no encontrado" });
        }

        const actualizado = await prisma.prestamo.update({
            where: { id: Number(id) },
            data: {
                estado: "DEVUELTO",
                fechaDevolucion: new Date()
            },
            include: { usuario: true, libro: true }
        });

        // ✅ BUG CORREGIDO: URL bien formada
        await axios.put(
            `${process.env.BOOK_SERVICE}/api/books/${prestamo.libroId}`,
            { disponible: true }
        );

        res.json({
            mensaje: "Libro devuelto correctamente",
            prestamo: actualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.response?.data?.error || error.response?.data || error.message
        });
    }
};

// Eliminar préstamo
exports.deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.prestamo.delete({
            where: { id: Number(id) }
        });
        res.json({ mensaje: "Préstamo eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};