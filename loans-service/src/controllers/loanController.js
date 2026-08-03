const prisma = require("../config/prisma");

// Obtener todos los préstamos
exports.getLoans = async (req, res) => {
    try {
        const loans = await prisma.prestamo.findMany({
            include: { usuario: true, libro: true },
            orderBy: { id: "asc" }
        });
        res.json(loans);
    } catch (error) {
        console.error("getLoans error:", error);
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
        console.error("getLoanById error:", error);
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

        if (isNaN(uid) || isNaN(lid)) {
            return res.status(400).json({
                error: "usuarioId y libroId deben ser números válidos"
            });
        }

        // Verificar usuario existe
        const usuario = await prisma.usuario.findUnique({
            where: { id: uid }
        });
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar libro existe
        const libro = await prisma.libro.findUnique({
            where: { id: lid }
        });
        if (!libro) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        if (!libro.disponible) {
            return res.status(400).json({
                error: "El libro ya está prestado"
            });
        }

        // Crear préstamo
        const prestamo = await prisma.prestamo.create({
            data: { usuarioId: uid, libroId: lid },
            include: { usuario: true, libro: true }
        });

        // Marcar libro como no disponible
       