// Importación de la instancia singleton de Prisma Client previamente configurada
const prisma = require("../config/prisma");

// ==========================================
// OBTENER TODOS LOS USUARIOS
// ==========================================
// Función asíncrona para consultar y retornar el listado completo de usuarios
exports.getUsers = async (req, res) => {
  try {
    // Consulta a la base de datos para obtener todos los registros del modelo Usuario
    const usuarios = await prisma.usuario.findMany();
    
    // Retorna la lista de usuarios con código de estado HTTP 200 (OK) por defecto
    res.json(usuarios);
  } catch (error) {
    // Registra el error en la consola del servidor para depuración
    console.error(error);
    
    // Devuelve un error interno del servidor (HTTP 500) con el mensaje de la excepción
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// OBTENER UN USUARIO POR SU ID
// ==========================================
// Función asíncrona para buscar un usuario específico según el parámetro de la ruta
exports.getUserById = async (req, res) => {
  try {
    // Convierte el parámetro 'id' enviado en la URL de String a Número Entero
    const id = parseInt(req.params.id);

    // Validación: Verifica si el ID no es un número válido (NaN)
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido", // Petición incorrecta (HTTP 400)
      });
    }

    // Busca un único registro en la base de datos cuyo ID coincida
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    // Si la consulta no devuelve ningún resultado, notifica que no existe
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado", // Recurso no encontrado (HTTP 404)
      });
    }

    // Retorna el objeto del usuario encontrado
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// CREAR UN NUEVO USUARIO
// ==========================================
// Función asíncrona para registrar un nuevo usuario recibiendo datos en el body
exports.createUser = async (req, res) => {
  try {
    // Extrae los campos requeridos del cuerpo de la petición (req.body)
    const { nombre, correo, cedula } = req.body;

    // Validación de presencia: Garantiza que ninguno de los tres campos obligatorios esté vacío
    if (!nombre || !correo || !cedula) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Inserción en la base de datos utilizando el método create de Prisma
    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        cedula,
      },
    });

    // Retorna código 201 (Creado) junto con el objeto recién generado y un mensaje de éxito
    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevo,
    });
  } catch (error) {
    console.error(error);

    // Captura el código de error nativo de Prisma 'P2002' (Violación de restricción única: correo o cédula repetida)
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "El correo o la cédula ya existen",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// ACTUALIZAR UN USUARIO
// ==========================================
// Función asíncrona para modificar los datos de un usuario existente por su ID
exports.updateUser = async (req, res) => {
  try {
    // Convierte el ID recibido en la ruta a entero
    const id = parseInt(req.params.id);

    // Validación de tipo de dato para el ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    // Actualiza en la base de datos aplicando únicamente los campos enviados en req.body
    const usuario = await prisma.usuario.update({
      where: { id },
      data: req.body,
    });

    // Retorna el usuario ya actualizado y confirmación
    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);

    // Captura el código de error nativo de Prisma 'P2025' (Registro no encontrado para realizar la acción)
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// ELIMINAR UN USUARIO
// ==========================================
// Función asíncrona para remover un usuario de la base de datos según su ID
exports.deleteUser = async (req, res) => {
  try {
    // Convierte el ID recibido en la ruta a entero
    const id = parseInt(req.params.id);

    // Validación de tipo de dato para el ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
      });
    }

    // Elimina el registro de la tabla Usuario que coincida con la clave primaria
    await prisma.usuario.delete({
      where: { id },
    });

    // Confirma la eliminación exitosa
    res.json({
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(error);

    // Captura el error de Prisma 'P2025' si se intenta eliminar un registro que no existe
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.status(500).json({ error: error.message });
  }
};