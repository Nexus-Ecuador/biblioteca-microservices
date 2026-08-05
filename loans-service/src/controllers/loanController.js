// Importación de la instancia del cliente de Prisma
const prisma = require("../config/prisma");

// ==========================================
// FUNCIÓN AUXILIAR DE ENRIQUECIMIENTO
// ==========================================
// Función asíncrona que consulta la información completa del Usuario y del Libro
// asociados a un préstamo, agregando valores por defecto si no se encuentran.
async function enriquecer(p) {
  // Consulta a la BD para obtener la información del usuario vinculado
  const u = await prisma.usuario.findUnique({ where: { id: p.usuarioId } });
  
  // Consulta a la BD para obtener la información del libro vinculado
  const l = await prisma.libro.findUnique({ where: { id: p.libroId } });
  
  // Construye y retorna el objeto de préstamo extendido con los datos completos
  return {
    id: p.id,
    usuarioId: p.usuarioId,
    libroId: p.libroId,
    fechaPrestamo: p.fechaPrestamo,
    fechaDevolucion: p.fechaDevolucion,
    estado: p.estado,
    // Si el usuario existe lo asigna; de lo contrario, incluye un objeto por defecto (fallback)
    usuario: u || { id: p.usuarioId, nombre: "Desconocido", correo: "-", cedula: "-" },
    // Si el libro existe lo asigna; de lo contrario, incluye un objeto por defecto (fallback)
    libro: l || { id: p.libroId, titulo: "Desconocido", autor: "-", isbn: null, categoria: null, disponible: false }
  };
}

// ==========================================
// OBTENER TODOS LOS PRÉSTAMOS
// ==========================================
// Función asíncrona para consultar todos los préstamos y enriquecer sus datos en paralelo
exports.getLoans = async (req, res) => {
  try {
    // Consulta todos los préstamos ordenados ascendentemente por ID
    const r = await prisma.prestamo.findMany({ orderBy: { id: "asc" } });
    
    // Ejecuta de forma paralela la función 'enriquecer' para cada registro del arreglo
    res.json(await Promise.all(r.map(enriquecer)));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// ==========================================
// OBTENER UN PRÉSTAMO POR SU ID
// ==========================================
// Función asíncrona para buscar y retornar un préstamo específico con sus relaciones
exports.getLoanById = async (req, res) => {
  try {
    // Busca en la BD el préstamo coincidente con el ID numérico recibido en req.params
    const p = await prisma.prestamo.findUnique({ where: { id: Number(req.params.id) } });
    
    // Si no encuentra el registro, responde con un código HTTP 404
    if (!p) return res.status(404).json({ error: "No encontrado" });
    
    // Retorna el préstamo enriquecido con la información del usuario y libro
    res.json(await enriquecer(p));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// ==========================================
// CREAR UN NUEVO PRÉSTAMO
// ==========================================
// Función asíncrona para procesar un préstamo, validando la existencia de entidades y disponibilidad
exports.createLoan = async (req, res) => {
  try {
    // Extrae las claves foráneas obligatorias del cuerpo de la solicitud
    const { usuarioId, libroId } = req.body;
    
    // Validación: Verifica que ambos valores estén presentes en req.body
    if (!usuarioId || !libroId) return res.status(400).json({ error: "usuarioId y libroId obligatorios" });
    
    // Conversión a tipo numérico de los IDs
    const uid = Number(usuarioId), lid = Number(libroId);
    
    // Validación de tipos: Verifica que no sean NaN
    if (isNaN(uid) || isNaN(lid)) return res.status(400).json({ error: "IDs deben ser numeros" });
    
    // Verifica existencia previa del Usuario en la BD
    const u = await prisma.usuario.findUnique({ where: { id: uid } });
    if (!u) return res.status(404).json({ error: "Usuario no encontrado" });
    
    // Verifica existencia previa del Libro en la BD
    const l = await prisma.libro.findUnique({ where: { id: lid } });
    if (!l) return res.status(404).json({ error: "Libro no encontrado" });
    
    // Regla de negocio: Verifica si el libro se encuentra disponible para préstamo
    if (!l.disponible) return res.status(400).json({ error: "Libro ya prestado" });
    
    // Inserción: Registra la transacción de préstamo en la base de datos
    const p = await prisma.prestamo.create({ data: { usuarioId: uid, libroId: lid } });
    
    // Actualización de estado: Cambia la disponibilidad del libro prestado a false
    await prisma.libro.update({ where: { id: lid }, data: { disponible: false } });
    
    // Responde con estado HTTP 201 (Creado) y el préstamo enriquecido
    res.status(201).json({ mensaje: "Prestamo realizado", prestamo: await enriquecer(p) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// ==========================================
// ACTUALIZAR PRÉSTAMO (MARCAR COMO DEVUELTO)
// ==========================================
// Función asíncrona para registrar la devolución de un libro prestado
exports.updateLoan = async (req, res) => {
  try {
    // Obtiene el ID del préstamo a través de los parámetros
    const id = Number(req.params.id);
    
    // Consulta la existencia previa del préstamo
    const p = await prisma.prestamo.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "No encontrado" });
    
    // Modifica el estado del préstamo a "DEVUELTO" y registra la fecha/hora actual de devolución
    const a = await prisma.prestamo.update({
      where: { id },
      data: { estado: "DEVUELTO", fechaDevolucion: new Date() }
    });
    
    // Libera el libro involucrado cambiando su disponibilidad a true
    await prisma.libro.update({ where: { id: p.libroId }, data: { disponible: true } });
    
    // Responde confirmando la devolución e incluyendo el objeto del préstamo actualizado
    res.json({ mensaje: "Devuelto", prestamo: await enriquecer(a) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

// ==========================================
// ELIMINAR UN PRÉSTAMO
// ==========================================
// Función asíncrona para borrar el registro de un préstamo según su ID
exports.deleteLoan = async (req, res) => {
  try {
    // Ejecuta la eliminación directa en la tabla Prestamo según su clave primaria
    await prisma.prestamo.delete({ where: { id: Number(req.params.id) } });
    
    // Retorna la confirmación de la eliminación
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
// ==========================================
// FIN DEL ARCHIVO
// ==========================================