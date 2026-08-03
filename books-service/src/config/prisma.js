generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Usuario {
  id      Int    @id @default(autoincrement())
  nombre  String
  correo  String @unique
  cedula  String @unique
}

model Libro {
  id          Int     @id @default(autoincrement())
  titulo      String
  autor       String
  isbn        String  @unique
  categoria   String?
  disponible  Boolean @default(true)
}

model Prestamo {
  id              Int       @id @default(autoincrement())
  usuarioId       Int
  libroId         Int
  fechaPrestamo   DateTime  @default(now())
  fechaDevolucion DateTime?
  estado          String    @default("PRESTADO")
}