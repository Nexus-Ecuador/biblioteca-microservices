// Importación de la clase PrismaClient desde el paquete generado por Prisma ORM
const { PrismaClient } = require("@prisma/client");

// ==========================================
// INSTANCIACIÓN DE PRISMA CLIENT (SINGLETON)
// ==========================================
// Se crea una única instancia de PrismaClient configurando los niveles de logs dinámicamente:
// - En entorno de desarrollo ("development"): Registra tanto las consultas SQL generadas ("query") como los errores ("error").
// - En entorno de producción u otros: Únicamente registra los errores ("error") para optimizar el rendimiento y seguridad.
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"]
});

// ==========================================
// EXPORTACIÓN DEL CLIENTE PRISMA
// ==========================================
// Exporta la instancia singleton para ser reutilizada en todos los controladores sin abrir múltiples conexiones a la BD
module.exports = prisma;
// ==========================================
// FIN DEL ARCHIVO
// ==========================================