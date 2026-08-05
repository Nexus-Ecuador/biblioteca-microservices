// Importación del framework Express para la definición de los endpoints del router
const express = require("express");

// Inicialización del enrutador modular de Express
const router = express.Router();

// Importación del controlador de préstamos que contiene la lógica para la gestión de transacciones
const controller = require("../controllers/loanController");

// ==========================================
// DEFINICIÓN DE RUTAS DE PRÉSTAMOS
// Prefijo base asignado en el servidor principal: /api/prestamos
// ==========================================

// Ruta GET /api/prestamos
// Obtiene la lista completa de préstamos enriquecida con información del usuario y libro
router.get("/", controller.getLoans);

// Ruta GET /api/prestamos/:id
// Obtiene el detalle de un préstamo específico filtrado por su ID
router.get("/:id", controller.getLoanById);

// Ruta POST /api/prestamos
// Registra un nuevo préstamo, valida existencias y cambia la disponibilidad del libro a false
router.post("/", controller.createLoan);

// Ruta PUT /api/prestamos/:id
// Marca un préstamo como "DEVUELTO", registra fecha de devolución y restituye la disponibilidad del libro
router.put("/:id", controller.updateLoan);

// Ruta DELETE /api/prestamos/:id
// Elimina un registro de préstamo de la base de datos por su ID
router.delete("/:id", controller.deleteLoan);

// ==========================================
// EXPORTACIÓN DEL MÓDULO DE RUTAS
// ==========================================
// Exporta la configuración de rutas para que sea consumida por la aplicación Express
module.exports = router;
// ==========================================
// FIN DEL ARCHIVO
// ==========================================