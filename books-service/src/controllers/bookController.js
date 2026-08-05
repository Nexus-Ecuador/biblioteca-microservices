// Importación del cliente de Prisma instanciado centralmente
const prisma = require("../config/prisma");

// ==========================================
// OBTENER TODOS LOS LIBROS
// ==========================================
// Función asíncrona para obtener el listado completo de libros ordenados por ID
exports.getBooks = async (req, res) => {
    try {
        // Consulta todos los libros en la base de datos ordenados de forma ascendente por su clave primaria (id)
        const libros = await prisma.libro.findMany({
            orderBy: { id: "asc" }
        });
        
        // Devuelve el arreglo de libros con estado HTTP 200 (OK)
        res.json(libros);
    } catch (error) {
        // Registra el error en consola especificando el contexto del fallo
        console.error("getBooks error:", error);
        
        // Notifica un error interno del servidor (HTTP 500)
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// OBTENER LIBRO POR ID
// ==========================================
// Función asíncrona para buscar un único libro mediante su ID
exports.getBookById = async (req, res) => {
    try {
        // Convierte el parámetro numérico recibido en la URL de tipo String a Number
        const id = Number(req.params.id);

        // Validación: Verifica si el ID procesado no es un número válido (NaN)
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        // Realiza la búsqueda del registro en la tabla Libro mediante su clave única
        const libro = await prisma.libro.findUnique({ where: { id } });

        // Si el libro no existe en la base de datos, retorna un estado HTTP 404
        if (!libro) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        // Retorna la información del libro encontrado
        res.json(libro);
    } catch (error) {
        console.error("getBookById error:", error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// CREAR UN NUEVO LIBRO
// ==========================================
// Función asíncrona para registrar un libro aplicando sanitización de datos
exports.createBook = async (req, res) => {
    try {
        // Extrae las propiedades enviadas en el cuerpo de la petición (req.body)
        const { titulo, autor, isbn, categoria, disponible } = req.body;

        // Validación de campos requeridos: Garantiza que el título y autor estén presentes
        if (!titulo || !autor) {
            return res.status(400).json({ error: "Título y autor son obligatorios" });
        }

        // Estructuración del objeto 'data' aplicando eliminación de espacios en blanco sobrantes (trim)
        const data = {
            titulo: titulo.trim(),
            autor: autor.trim(),
            categoria: categoria ? categoria.trim() : null, // Si existe categoría la limpia, de lo contrario guarda null
            disponible: disponible === undefined ? true : Boolean(disponible) // Asigna true por defecto si no viene en el body
        };

        // Asignación condicional de ISBN: Se incluye únicamente si contiene texto válido con contenido no vacío
        if (isbn && typeof isbn === "string" && isbn.trim() !== "") {
            data.isbn = isbn.trim();
        }

        // Inserta el nuevo registro en la base de datos a través de Prisma
        const libro = await prisma.libro.create({ data });

        // Devuelve el estado HTTP 201 (Creado) junto con la confirmación y los datos del libro creado
        res.status(201).json({
            mensaje: "Libro creado correctamente",
            libro
        });
    } catch (error) {
        console.error("createBook error:", error);

        // Manejo específico del error Prisma P2002 (Violación de restricción única en el campo ISBN)
        if (error.code === "P2002") {
            return res.status(400).json({
                error: "El ISBN ya está registrado. Usa uno diferente o déjalo vacío."
            });
        }

        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// ACTUALIZAR UN LIBRO
// ==========================================
// Función asíncrona para actualizar los datos de un libro por su ID
exports.updateBook = async (req, res) => {
    try {
        // Convierte el ID recibido desde los parámetros de la URL
        const id = Number(req.params.id);

        // Valida que el ID recibido sea numérico
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        // Actualiza el registro en la base de datos pasando directamente los campos enviados en req.body
        const libro = await prisma.libro.update({
            where: { id },
            data: req.body
        });

        // Retorna confirmación de la actualización y el objeto modificado
        res.json({
            mensaje: "Libro actualizado correctamente",
            libro
        });
    } catch (error) {
        console.error("updateBook error:", error);
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// ELIMINAR UN LIBRO
// ==========================================
// Función asíncrona para eliminar físicamente un libro de la base de datos
exports.deleteBook = async (req, res) => {
    try {
        // Convierte el ID recibido desde los parámetros de la URL
        const id = Number(req.params.id);

        // Valida que el ID recibido sea numérico
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        // Borra el registro coincidente con la clave primaria
        await prisma.libro.delete({ where: { id } });

        // Devuelve el mensaje de confirmación de eliminación exitosa
        res.json({ mensaje: "Libro eliminado correctamente" });
    } catch (error) {
        console.error("deleteBook error:", error);
        res.status(500).json({ error: error.message });
    }
};