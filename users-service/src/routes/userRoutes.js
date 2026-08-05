// Importación del framework Express para la definición de los endpoints del router
const express = require("express");

// Inicialización de la instancia del enrutador (Router) modular de Express
const router = express.Router();

// Importación del controlador de usuarios que contiene la lógica de negocio para cada endpoint
const controller = require("../controllers/userController");

// ==========================================
// DEFINICIÓN DE RUTAS DE USUARIOS
// Prefix base asignado en app.js: /api/users
// ==========================================

// Ruta GET /api/users
// Obtiene el listado completo de todos los usuarios registrados
router.get("/", controller.getUsers);

// Ruta GET /api/users/:id
// Obtiene la información de un usuario específico según su ID numérico
router.get("/:id", controller.getUserById);

// Ruta POST /api/users
// Crea y registra un nuevo usuario en la base de datos
router.post("/", controller.createUser);

// Ruta PUT /api/users/:id
// Actualiza los datos de un usuario existente filtrado por su ID
router.put("/:id", controller.updateUser);

// Ruta DELETE /api/users/:id
// Elimina un usuario de la base de datos mediante su ID
router.delete("/:id", controller.deleteUser);

// ==========================================
// EXPORTACIÓN DEL ENRUTADOR
// ==========================================
// Exporta la configuración de rutas para ser vinculada en la aplicación principal (app.js)
module.exports = router;