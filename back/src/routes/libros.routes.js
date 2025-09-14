const express = require('express');
const router = express.Router();
const LibrosController = require('../controllers/libros.controller');
const librosController = new LibrosController();

//Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const libros = await librosController.obtenerTodos();
        res.json(libros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener libros', error });
    }
});

//Obtener libro con sus ejemplares
router.get('/:id', async (req, res) => {
    try {
        const libro = await librosController.obtenerConEjemplares(req.params.id);
        if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
        res.json(libro);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener libro', error });
    }
});

//Buscar libros por filtro
router.get('/buscar/:filtro', async (req, res) => {
    try {
        const resultados = await librosController.buscar(req.params.filtro);
        res.json(resultados);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar libros', error });
    }
});

module.exports = router;