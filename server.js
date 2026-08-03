const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS explícito para GitHub Pages
const corsOptions = {
    origin: [
        "https://nexus-ecuador.github.io",
        "http://localhost:3000",
        "http://127.0.0.1:5500"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
const userRoutes = require("./users-service/src/routes/userRoutes");
const bookRoutes = require("./books-service/src/routes/bookRoutes");
const loanRoutes = require("./loans-service/src/routes/loanRoutes");

app.get("/", (req, res) => {
    res.json({
        proyecto: "Biblioteca Microservices",
        estado: "Activo",
        rutas: ["/api/users", "/api/books", "/api/prestamos"]
    });
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/prestamos", loanRoutes);

// Health check para Render
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});