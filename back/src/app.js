const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/libros', require('./routes/libros.routes'));
app.use('/api/prestamos', require('./routes/prestamos.routes'));

module.exports = app;
