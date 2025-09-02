const express = require("express");
const router = express.Router();

// Controladores de libros
const {
    getLibros,
    getLibroById,
    createLibro,
    updateLibro,
    deleteLibro
} = require("../controllers/libros.controller");

// Middlewares
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Listar todos los libros → acceso público (opcional) o autenticado
router.get("/", authMiddleware, getLibros);

// Obtener un libro por ID
router.get("/:id", authMiddleware, getLibroById);

// Crear nuevo libro → solo Profesor
router.post(
    "/",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    createLibro
);

// Editar libro → solo Profesor
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    updateLibro
);

// Eliminar libro → solo Profesor
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    deleteLibro
);

module.exports = router;