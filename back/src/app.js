const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const usuarioRoutes = require("./routes/usuarios.routes");
const libroRoutes = require("./routes/libros.routes");
const prestamoRoutes = require("./routes/prestamos.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/libros", libroRoutes);
app.use("/prestamos", prestamoRoutes);

module.exports = app;