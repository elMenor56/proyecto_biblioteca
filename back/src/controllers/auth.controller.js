const db = require('../config/conexion_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Registrar usuario
const register = async (req, res) => {
    try {
        const { nombre, email, password, tipo } = req.body;

        if(!["Estudiante", "Profesor"].includes(tipo)) {
            return res.status(400).json({ error: "Tipo de usuario invalido" });
        }

        const [existe] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existe.length > 0) {
            return res.status(400).json({ error: "EL email ya esta registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO usuarios (nombre, email, password, tipo) VALUES (?, ?, ?, ?)", [nombre, email, hashedPassword, tipo]
        );

        res.json({ id: result.insertId, nombre, email, tipo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuarios.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const usuario = usuarios[0];
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, tipo: usuario.tipo },
            process.env.JWT_SECRET || "secreto123",
            { expiresIn: "2h" }
        );

        res.json({ token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, tipo: usuario.tipo } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Perfil protegido
const perfil = (req, res) => {
    res.json({ usuario: req.user });
};

module.exports = { register, login, perfil };