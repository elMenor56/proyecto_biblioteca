const express = require("express");
const router = express.Router();

// Importamos los controladores de usuarios
const { getUsuarios, getUsuarioById, deleteUsuario } = require("../controllers/usuarios.controller");

// Importamos los middlewares
const authMiddleware = require("../middlewares/authMiddleware"); // Verifica que haya un token válido
const roleMiddleware = require("../middlewares/roleMiddleware"); // Verifica que el rol tenga permisos

// 📌 Ruta: Obtener todos los usuarios
// Solo puede acceder un Profesor (admin)
// Ejemplo de uso: GET http://localhost:3000/usuarios
router.get(
    "/",
    authMiddleware,                // Verifica que el usuario esté autenticado
    roleMiddleware(["Profesor"]),  // Permite acceso solo si el usuario es Profesor
    getUsuarios                    // Controlador que devuelve todos los usuarios
);

// 📌 Ruta: Obtener un usuario por ID
// Solo puede acceder un Profesor
// Ejemplo de uso: GET http://localhost:3000/usuarios/1
router.get(
    "/:id",
    authMiddleware,                // Verifica que el usuario tenga token
    roleMiddleware(["Profesor"]),  // Solo Profesores pueden consultar usuarios
    getUsuarioById                 // Controlador que devuelve un usuario específico
);

// 📌 Ruta: Eliminar un usuario por ID
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Profesor"]),
    deleteUsuario
);

module.exports = router;