// Importamos el db/objeto de conexión a la base de datos (ajusta la ruta si tu archivo se llama diferente)
const db = require('../config/conexion_db');

// Función: Obtener todos los usuarios (sin retornar sus contraseñas)
// Esta ruta debe estar protegida (ej. solo Profesores pueden llamarla)
const getUsuarios = async (req, res) => {
    try {
    // Ejecutamos la consulta seleccionando solo campos públicos (excluimos 'password')
    const [rows] = await db.query("SELECT id_usuario, nombre, email, tipo FROM usuarios");
    // Enviamos el resultado (array de usuarios) al cliente
    return res.json(rows);
    } catch (error) {
        // Si ocurre un error al consultar la BD, devolvemos 500 con el mensaje
        return res.status(500).json({ error: error.message });
    }
};

// Función: Obtener un usuario por su id (sin contraseña)
// Esta ruta puede ser usada por Profesores para ver datos de un usuario específico
const getUsuarioById = async (req, res) => {
    try {
    // Extraemos el id desde los parámetros de la ruta
    const { id } = req.params;
    // Ejecutamos la consulta buscando por id_usuario y excluyendo 'password'
    const [rows] = await db.query(
        "SELECT id_usuario, nombre, email, tipo FROM usuarios WHERE id_usuario = ?",
        [id]
    );
    // Si no existe el usuario, respondemos 404
    if (rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // Si existe, devolvemos el primer (y único) registro encontrado
    return res.json(rows[0]);
    } catch (error) {
    // En caso de error de BD devolvemos 500 con el mensaje
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exportamos las funciones para usarlas en las rutas (usuarios.routes.js)
module.exports = { getUsuarios, getUsuarioById, deleteUsuario };