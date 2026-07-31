const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const bookRoutes = require("./src/routes/bookRoutes");

app.get("/", (req, res) => {
    res.json({
        microservice: "Books",
        status: "Activo"
    });
});

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`🚀 Books Service ejecutándose en http://localhost:${PORT}`);
});