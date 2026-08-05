// Importación del framework Express para la creación del servidor HTTP y la definición de rutas
const express = require("express");

// Importación del middleware CORS para permitir peticiones entre diferentes orígenes (cross-origin)
const cors = require("cors");

// Carga las variables de entorno definidas en el archivo .env hacia process.env
require("dotenv").config();

// Inicialización de la aplicación Express
const app = express();

// ==========================================
// CONFIGURACIÓN DE CORS
// ==========================================
// Define los orígenes permitidos, métodos HTTP autorizados y cabeceras aceptadas
const corsOptions = {
    // Lista de dominios permitidos para realizar solicitudes al backend (GitHub Pages y entornos locales)
    origin: [
        "https://nexus-ecuador.github.io",
        "http://localhost:3000",
        "http://127.0.0.1:5500"
    ],
    // Métodos HTTP permitidos para las peticiones
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // Cabeceras HTTP permitidas en las peticiones entrantes
    allowedHeaders: ["Content-Type", "Authorization"],
    // Permite el envío de cookies o cabeceras de autenticación en solicitudes entre dominios
    credentials: true
};

// Aplicación del middleware CORS con las opciones configuradas a nivel global
app.use(cors(corsOptions));

// Middleware de Express para parsear automáticamente los cuerpos de peticiones en formato JSON (req.body)
app.use(express.json());

// ==========================================
// IMPORTACIÓN DE RUTAS DE MICROSERVICIOS
// ==========================================
// Carga de los enrutadores correspondientes a cada módulo funcional de la aplicación
const userRoutes = require("./users-service/src/routes/userRoutes");
const bookRoutes = require("./books-service/src/routes/bookRoutes");
const loanRoutes = require("./loans-service/src/routes/loanRoutes");

// ==========================================
// DEFINICIÓN DE RUTAS Y ENDPOINTS
// ==========================================

// Ruta raíz (GET /): Retorna un mensaje descriptivo con la información general y estado de la API
app.get("/", (req, res) => {
    res.json({
        proyecto: "Biblioteca Microservices",
        estado: "Activo",
        rutas: ["/api/users", "/api/books", "/api/prestamos"]
    });
});

// Registro de los módulos de rutas con su respectivo prefijo de URL
app.use("/api/users", userRoutes);     // Endpoints relacionados con la gestión de usuarios
app.use("/api/books", bookRoutes);     // Endpoints relacionados con la gestión de libros
app.use("/api/prestamos", loanRoutes); // Endpoints relacionados con el control de préstamos

// Endpoint de verificación de estado (GET /health): Utilizado por servicios de despliegue como Render para monitorear la disponibilidad de la app
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
// Asignación del puerto asignado por el entorno (Render, Heroku, etc.) o por defecto el puerto 10000
const PORT = process.env.PORT || 10000;

// Inicio de la escucha de peticiones en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});