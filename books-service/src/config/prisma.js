const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

console.log(
    "DATABASE USERS:",
    process.env.DATABASE_URL ? "OK" : "NO EXISTE"
);

const prisma = new PrismaClient();

module.exports = prisma;