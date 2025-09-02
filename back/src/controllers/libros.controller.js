const db = require("../config/conexion_db");

//Listar libros
const getLibros = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM libros");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un libro por ID
const getLibroById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM libros WHERE id_libro = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Libro no encontrado" });
    }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Crear libro (Solo profesor)
const createLibro = async (req, res) => {
    try {
        const { titulo, anio_publicacion, categoria } = req.body;
        const [result] = await db.query(
            "INSERT INTO libros (titulo, anio_publicacion, categoria) VALUES (?, ?, ?)",
            [titulo, anio_publicacion, categoria]
        );
        res.json({ id: result.insertId, titulo, anio_publicacion, categoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Editar Libro (solo profesor)
const updateLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, anio_publicacion, categoria } = req.body;

        const [result] = await db.query(
            "UPDATE libros SET titulo = ?, anio_publicacion = ?, categoria = ? WHERE id_libro = ?",
            [titulo, anio_publicacion, categoria, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        res.json({ id, titulo, anio_publicacion, categoria });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar libro (solo Profesor, validando que no tenga préstamos activos)
const deleteLibro = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el libro tiene préstamos activos
        const [prestamos] = await db.query(
            "SELECT * FROM prestamos p JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar WHERE e.id_libro = ? AND p.fecha_dev_real IS NULL",
            [id]
        );
        if (prestamos.length > 0) {
            return res.status(400).json({ error: "No se puede eliminar, el libro tiene préstamos activos" });
        }

        const [result] = await db.query("DELETE FROM libros WHERE id_libro = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Libro no encontrado" });
        }

        res.json({ mensaje: "Libro eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getLibros, getLibroById, createLibro, updateLibro, deleteLibro };