
# Generar loanController.js bulletproof (sin include, sin dependencia de relaciones Prisma)
loan_controller = '''const prisma = require("../config/prisma");

// Helper: enriquecer préstamo con datos de usuario y libro
async function enriquecerPrestamo(p) {
    const usuario = await prisma.usuario.findUnique({ where: { id: p.usuarioId } });
    const libro = await prisma.libro.findUnique({ where: { id: p.libroId } });
    return {
        id: p.id,
        usuarioId: p.usuarioId,
        libroId: p.libroId,
        fechaPrestamo: p.fechaPrestamo,
        fechaDevolucion: p.fechaDevolucion,
        estado: p.estado,
        usuario: usuario || { id: p.usuarioId, nombre: "Desconocido", correo: "-", cedula: "-" },
        libro: libro || { id: p.libroId, titulo: "Desconocido", autor: "-", isbn: null, categoria: null, disponible: false }
    };
}

// Obtener todos los préstamos
exports.getLoans = async (req, res) => {
    try {
        const raw = await prisma.prestamo.findMany({ orderBy: { id: "asc" } });
        const loans = await Promise.all(raw.map(enriquecerPrestamo));
        res.json(loans);
    } catch (error) {
        console.error("getLoans error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener préstamo por ID
exports.getLoanById = async (req, res) => {
    try {
        const p = await prisma.prestamo.findUnique({ where: { id: Number(req.params.id) } });
        if (!p) return res.status(404).json({ error: "Préstamo no encontrado" });
        const loan = await enriquecerPrestamo(p);
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
            return res.status(400).json({ error: "usuarioId y libroId son obligatorios" });
        }
        const uid = Number(usuarioId);
        const lid = Number(libroId);
        if (isNaN(uid) || isNaN(lid)) {
            return res.status(400).json({ error: "usuarioId y libroId deben ser números válidos" });
        }

        const usuario = await prisma.usuario.findUnique({ where: { id: uid } });
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

        const libro = await prisma.libro.findUnique({ where: { id: lid } });
        if (!libro) return res.status(404).json({ error: "Libro no encontrado" });
        if (!libro.disponible) return res.status(400).json({ error: "El libro ya está prestado" });

        const p = await prisma.prestamo.create({
            data: { usuarioId: uid, libroId: lid }
        });

        await prisma.libro.update({ where: { id: lid }, data: { disponible: false } });

        const prestamo = await enriquecerPrestamo(p);
        res.status(201).json({ mensaje: "Préstamo realizado correctamente", prestamo });
    } catch (error) {
        console.error("createLoan error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Devolver préstamo
exports.updateLoan = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const p = await prisma.prestamo.findUnique({ where: { id } });
        if (!p) return res.status(404).json({ error: "Préstamo no encontrado" });

        const actualizado = await prisma.prestamo.update({
            where: { id },
            data: { estado: "DEVUELTO", fechaDevolucion: new Date() }
        });

        await prisma.libro.update({ where: { id: p.libroId }, data: { disponible: true } });

        const prestamo = await enriquecerPrestamo(actualizado);
        res.json({ mensaje: "Libro devuelto correctamente", prestamo });
    } catch (error) {
        console.error("updateLoan error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar préstamo
exports.deleteLoan = async (req, res) => {
    try {
        await prisma.prestamo.delete({ where: { id: Number(req.params.id) } });
        res.json({ mensaje: "Préstamo eliminado correctamente" });
    } catch (error) {
        console.error("deleteLoan error:", error);
        res.status(500).json({ error: error.message });
    }
};
'''

with open('/mnt/agents/output/loanController.js', 'w', encoding='utf-8') as f:
    f.write(loan_controller)

print(f"Archivo generado: {len(loan_controller)} caracteres, {loan_controller.count(chr(10))} líneas")
