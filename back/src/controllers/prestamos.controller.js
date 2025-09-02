const db = require("../config/conexion_db");

// Listar préstamos (solo Profesor)
const getPrestamos = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM prestamos");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear préstamo (Estudiante o Profesor)
const createPrestamo = async (req, res) => {
    try {
        const { id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista } = req.body;
        const [result] = await db.query(
        "INSERT INTO prestamos (id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista) VALUES (?, ?, ?, ?)",
        [id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista]
        );
        res.json({ id: result.insertId, id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Devolver préstamo (Profesor)
const devolverPrestamo = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_dev_real } = req.body;
        await db.query(
        "UPDATE prestamos SET fecha_dev_real = ? WHERE id_prestamo = ?",
        [fecha_dev_real, id]
        );
        res.json({ message: "Préstamo devuelto correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Historial de usuario
const historialUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
        `SELECT p.*, l.titulo, e.codigo_ejemplar 
        FROM prestamos p
        JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
        JOIN libros l ON e.id_libro = l.id_libro
        WHERE p.id_usuario = ?`,
        [id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getPrestamos, createPrestamo, devolverPrestamo, historialUsuario };