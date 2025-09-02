const express = require("express");
const router = express.Router();

// Importamos los controladores de autenticación
const { register, login, perfil } = require("../controllers/auth.controller");

// Importamos middleware de autenticación (para perfil protegido)
const authMiddleware = require("../middlewares/authMiddleware");

// Registro de nuevo usuario (Estudiante o Profesor)
router.post("/register", register);

// Login (genera el token)
router.post("/login", login);

// Perfil protegido (requiere estar autenticado)
router.get("/perfil", authMiddleware, perfil);

module.exports = router;