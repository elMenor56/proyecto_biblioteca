const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

//Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const resultado = await authController.registrar(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al registrar usuario', error });
    }
});

//Inicio de sesion
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const resultado = await authController.iniciarSesion(correo, contrasenia);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al iniciar sesión', error });
    }
});

//Verificar usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const resultado = await authController.verificarUsuario(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al verificar usuario', error });
    }
});

module.exports = router;