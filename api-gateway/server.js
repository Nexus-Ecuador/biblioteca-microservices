const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// USERS
app.use(
    "/api/users",
    createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true
    })
);


// BOOKS
app.use(
    "/api/books",
    createProxyMiddleware({
        target: "http://localhost:3002",
        changeOrigin: true
    })
);


// LOANS
app.use(
    "/api/prestamos",
    createProxyMiddleware({
        target: "http://localhost:3003",
        changeOrigin: true
    })
);


const PORT = 4000;

app.listen(PORT,()=>{
    console.log(`API Gateway corriendo en puerto ${PORT}`);
});