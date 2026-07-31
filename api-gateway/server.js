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
        target: process.env.USERS_URL,
        changeOrigin: true
    })
);


// BOOKS
app.use(
    "/api/books",
    createProxyMiddleware({
        target: process.env.BOOKS_URL,
        changeOrigin: true
    })
);


// LOANS
app.use(
    "/api/prestamos",
    createProxyMiddleware({
        target: process.env.LOANS_URL,
        changeOrigin: true
    })
);


const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`API Gateway corriendo en puerto ${PORT}`);
});