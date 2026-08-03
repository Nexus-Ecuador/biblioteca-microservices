const { PrismaClient } = require("@prisma/client");

console.log("DATABASE_URL =", process.env.DATABASE_URL);
console.log("DIRECT_URL =", process.env.DIRECT_URL);

const prisma = new PrismaClient();

module.exports = prisma;