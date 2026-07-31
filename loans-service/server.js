const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const loanRoutes = require("./src/routes/loanRoutes");

app.use("/api/prestamos", loanRoutes);


const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});