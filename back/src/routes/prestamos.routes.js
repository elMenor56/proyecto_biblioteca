const express = require('express');
const router = express.Router();
const PrestamosController = require('../controllers/prestamos.controller');
const prestamosController = new PrestamosController();

// Crear préstamo
router.post('/', async (req, res) => {
    try {
        const { id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista } = req.body;
        const resultado = await prestamosController.crearPrestamo(id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista);
        res.json({ success: true, prestamo: resultado });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear préstamo', error });
    }
});

// Registrar devolución
router.put('/devolver/:id', async (req, res) => {
    try {
        const { fecha_dev_real } = req.body;
        const exito = await prestamosController.devolverPrestamo(req.params.id, fecha_dev_real);
        if (!exito) return res.status(404).json({ success: false, message: 'Préstamo no encontrado' });
        res.json({ success: true, message: 'Devolución registrada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al devolver préstamo', error });
    }
});

// Obtener todos los préstamos
router.get('/', async (req, res) => {
    try {
        const prestamos = await prestamosController.obtenerTodos();
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener préstamos', error });
    }
});

// Obtener préstamos activos
router.get('/activos', async (req, res) => {
    try {
        const activos = await prestamosController.obtenerActivos();
        res.json(activos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener préstamos activos', error });
    }
});

router.post('/crear-por-libro', async (req, res) => {
    const { id_usuario, id_libro } = req.body;
    try {
        const resultado = await prestamosController.crearPrestamoPorLibro(id_usuario, id_libro);
        if (!resultado.success) return res.status(400).json(resultado);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear préstamo', error });
    }
});


module.exports = router;