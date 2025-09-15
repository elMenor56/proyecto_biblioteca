const db = require('../config/conexion_db');

class PrestamosController {

    //Crear prestamo
    async crearPrestamo(id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista) {
        try {
            const [resultado] = await db.query(`
                INSERT INTO prestamos (id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista)
                VALUES (?, ?, ?, ?)
            `, [id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista]);

            return { id_prestamo: resultado.insertId };
        } catch (error) {
            throw error;
        }
    }

    //Registrar devolucion
    async devolverPrestamo(id_prestamo, fecha_dev_real) {
        try {
            const [resultado] = await db.query(`
                UPDATE prestamos
                SET fecha_dev_real = ?
                WHERE id_prestamo = ?
            `, [fecha_dev_real, id_prestamo]);

            return resultado.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    //Obtener historial de prestamos
    async obtenerTodos() {
        try {
            const [resultados] = await db.query(`
                SELECT p.id_prestamo,
                        u.nombre AS usuario,
                        l.titulo AS libro,
                        e.codigo_ejemplar,
                        p.fecha_prestamo,
                        p.fecha_dev_prevista,
                        p.fecha_dev_real
                FROM prestamos p
                INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                INNER JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
                INNER JOIN libros l ON e.id_libro = l.id_libro
                ORDER BY p.fecha_prestamo DESC
            `);

            return resultados;
        } catch (error) {
            throw error;
        }
    }

    //Obtener prestamos activos
    async obtenerActivos() {
        try {
            const [resultados] = await db.query(`
            SELECT p.id_prestamo,
                    u.id_usuario,
                    u.nombre AS usuario,
                    l.titulo AS libro,
                    e.codigo_ejemplar,
                    p.fecha_prestamo,
                    p.fecha_dev_prevista
            FROM prestamos p
            INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
            INNER JOIN ejemplar e ON p.id_ejemplar = e.id_ejemplar
            INNER JOIN libros l ON e.id_libro = l.id_libro
            WHERE p.fecha_dev_real IS NULL
            ORDER BY p.fecha_prestamo ASC
        `);

            return resultados;
        } catch (error) {
            throw error;
        }
    }

    async crearPrestamoPorLibro(id_usuario, id_libro) {
    try {
        // Buscar un ejemplar disponible
        const [ejemplares] = await db.query(`
            SELECT e.id_ejemplar
            FROM ejemplar e
            LEFT JOIN prestamos p
            ON e.id_ejemplar = p.id_ejemplar AND p.fecha_dev_real IS NULL
            WHERE e.id_libro = ? 
            LIMIT 1
        `, [id_libro]);

        if (ejemplares.length === 0) {
            return { success: false, message: 'No hay ejemplares disponibles' };
        }

        const id_ejemplar = ejemplares[0].id_ejemplar;
        const fechaPrestamo = new Date().toISOString().split('T')[0];
        const fechaDevPrevista = new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0];

        const [resultado] = await db.query(`
            INSERT INTO prestamos (id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista)
            VALUES (?, ?, ?, ?)
        `, [id_usuario, id_ejemplar, fechaPrestamo, fechaDevPrevista]);

        return { success: true, id_prestamo: resultado.insertId };

    } catch (error) {
        throw error;
    }
}
}

module.exports = PrestamosController