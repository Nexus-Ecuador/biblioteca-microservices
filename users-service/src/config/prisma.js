// Cliente de Prisma para conectarse a PostgreSQL
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;