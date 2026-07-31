const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const userRoutes = require("./src/routes/userRoutes");

console.log("Rutas cargadas:", userRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        microservice: "Usuarios",
        status: "Activo"
    });
});

// Rutas del microservicio
app.use("/api/users", userRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Users Service ejecutándose en http://localhost:${PORT}`);
});