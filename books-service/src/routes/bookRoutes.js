// Importación del framework Express para la creación de sub-rutas dentro del microservicio
const express = require("express");

// Inicialización de la instancia Router modular de Express
const router = express.Router();

// Importación del controlador de libros que almacena las funciones con la lógica de negocio
const controller = require("../controllers/bookController");

// ==========================================
// DEFINICIÓN DE RUTAS DE LIBROS
// Prefijo base asignado en el archivo principal: /api/books
// ==========================================

// Ruta GET /api/books
// Obtiene el catálogo completo de libros ordenados por ID
router.get("/", controller.getBooks);

// Ruta GET /api/books/:id
// Obtiene un libro en particular filtrado por su ID
router.get("/:id", controller.getBookById);

// Ruta POST /api/books
// Registra un nuevo libro en la base de datos previa sanitización e inclusión opcional de ISBN
router.post("/", controller.createBook);

// Ruta PUT /api/books/:id
// Actualiza los datos de un libro existente según su ID
router.put("/:id", controller.updateBook);

// Ruta DELETE /api/books/:id
// Elimina un libro de la base de datos por su ID
router.delete("/:id", controller.deleteBook);

// ==========================================
// EXPORTACIÓN DEL MÓDULO DE RUTAS
// ==========================================
// Exporta la configuración del enrutador para ser consumido en la aplicación principal Express
module.exports = router;
// ==========================================
// FIN DEL ARCHIVO
// ==========================================