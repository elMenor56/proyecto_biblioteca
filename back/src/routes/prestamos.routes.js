const express = require("express");
const router = express.Router();

// Controladores de préstamos
const {
    getPrestamos,
    createPrestamo,
    devolverPrestamo,
    historialUsuario
} = require("../controllers/prestamos.controller");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Listar todos los préstamos → solo Profesor
router.get(
    "/",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    getPrestamos
);

// Crear préstamo → cualquier usuario autenticado (Estudiante o Profesor)
router.post(
    "/",
    authMiddleware,
    createPrestamo
);

// Devolver préstamo → solo Profesor
router.put(
    "/devolver/:id",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    devolverPrestamo
);

// Historial de préstamos de un usuario → Profesor o el mismo usuario
router.get(
    "/usuario/:id",
    authMiddleware,
    historialUsuario
);

module.exports = router;