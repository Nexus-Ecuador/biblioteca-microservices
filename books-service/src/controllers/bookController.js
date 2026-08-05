const prisma = require("../config/prisma");

// Obtener todos los libros
exports.getBooks = async (req, res) => {
    try {
        const libros = await prisma.libro.findMany({
            orderBy: { id: "asc" }
        });
        res.json(libros);
    } catch (error) {
        console.error("getBooks error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener libro por ID
exports.getBookById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID invalido" });
        }

        const libro = await prisma.libro.findUnique({ where: { id } });
        if (!libro) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }
        res.json(libro);
    } catch (error) {
        console.error("getBookById error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Crear libro
exports.createBook = async (req, res) => {
    try {
        const { titulo, autor, isbn, categoria, disponible } = req.body;

        if (!titulo || !autor) {
            return res.status(400).json({ error: "Titulo y autor son obligatorios" });
        }

        const data = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            categoria: categoria ? categoria.trim() : null,
            disponible: disponible === undefined ? true : Boolean(disponible)
        };

        // Si el usuario envia un ISBN valido, lo usamos
        if (isbn && typeof isbn === "string" && isbn.trim() !== "") {
            data.isbn = isbn.trim();
        } else {
            // Si no envia ISBN, generamos uno unico automaticamente
            // usando timestamp + random para evitar colisiones
            data.isbn = `NO-ISBN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        const libro = await prisma.libro.create({ data });

        res.status(201).json({
            mensaje: "Libro creado correctamente",
            libro
        });
    } catch (error) {
        console.error("createBook error:", error);

        if (error.code === "P2002") {
            return res.status(400).json({
                error: "El ISBN ya esta registrado. Usa uno diferente."
            });
        }

        res.status(500).json({ error: error.message });
    }
};

// Actualizar libro
exports.updateBook = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID invalido" });
        }

        const libro = await prisma.libro.update({
            where: { id },
            data: req.body
        });

        res.json({
            mensaje: "Libro actualizado correctamente",
            libro
        });
    } catch (error) {
        console.error("updateBook error:", error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar libro
exports.deleteBook = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID invalido" });
        }

        await prisma.libro.delete({ where: { id } });

        res.json({ mensaje: "Libro eliminado correctamente" });
    } catch (error) {
        console.error("deleteBook error:", error);
        res.status(500).json({ error: error.message });
    }
};