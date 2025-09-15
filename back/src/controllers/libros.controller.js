const db = require('../config/conexion_db');

class LibrosController {

    //Obtener todos los libros
    async obtenerTodos(){
        try{
            const[resultados] = await db.query(`
            SELECT l.id_libro, l.titulo, l.anio_publicacion, l.categoria,
                (SELECT COUNT(*) 
                    FROM ejemplar e 
                    LEFT JOIN prestamos p 
                    ON e.id_ejemplar = p.id_ejemplar AND p.fecha_dev_real IS NULL
                    WHERE e.id_libro = l.id_libro AND p.id_prestamo IS NULL
                ) AS ejemplares_disponibles
            FROM libros l`);
            return resultados;
        } catch (error) {
            throw error;
        }
    }

    //Obtener libros con ejemplares
    async obtenerConEjemplares(id){
        try {
            const [libro] = await db.query(`
                SELECT id_libro, titulo, anio_publicacion, categoria
                FROM libros
                WHERE id_libro = ?
            `, [id]);

            if (libro.length === 0) return null;

            const [ejemplares] = await db.query(`
                SELECT e.id_ejemplar, e.codigo_ejemplar,
                    CASE
                        WHEN p.id_prestamo IS NOT NULL AND p.fecha_dev_real IS NULL
                        THEN 'No Disponible'
                        ELSE 'Disponible'
                    END AS disponibilidad
                FROM ejemplar e
                LEFT JOIN prestamos p
                ON e.id_ejemplar = p.id_ejemplar
                AND p.fecha_dev_real IS NULL
                WHERE e.id_libro = ?`
            ,[id]);
            return {
                ...libro[0],
                ejemplares
            };
        } catch (error) {
            throw error;
        }
    }

    //Filtro
    async buscar(filtro) {
        try {
            const [resultados] = await db.query(`
                SELECT id_libro, titulo, anio_publicacion, categoria
                FROM libros
                WHERE titulo LIKE ? OR categoria LIKE ?`, [`%${filtro}%`, `%${filtro}%`]);
            
            return resultados;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = LibrosController;