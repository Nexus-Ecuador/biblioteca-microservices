const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const userRoutes = require("./users-service/src/routes/userRoutes");
const bookRoutes = require("./books-service/src/routes/bookRoutes");
const loanRoutes = require("./loans-service/src/routes/loanRoutes");

app.get("/", (req, res) => {
    res.json({
        proyecto: "Biblioteca Microservices",
        estado: "Activo"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/prestamos", loanRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});