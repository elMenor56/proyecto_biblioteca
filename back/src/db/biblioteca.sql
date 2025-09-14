CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    tipo ENUM('Estudiante','Profesor') NOT NULL
);

CREATE TABLE libros (
    id_libro INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    anio_publicacion YEAR NOT NULL,
    categoria VARCHAR(100) NOT NULL
);

CREATE TABLE ejemplar (
    id_ejemplar INT PRIMARY KEY AUTO_INCREMENT,
    codigo_ejemplar VARCHAR(50) UNIQUE NOT NULL,
    id_libro INT NOT NULL,
    FOREIGN KEY (id_libro) REFERENCES libros(id_libro)
);

CREATE TABLE prestamos (
    id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_ejemplar INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_dev_prevista DATE NOT NULL,
    fecha_dev_real DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_ejemplar) REFERENCES ejemplar(id_ejemplar)
);


-- inserción de datos

INSERT INTO usuarios (nombre, correo, contrasenia, tipo) VALUES
('Ana López', 'ana@uni.edu', '123456', 'Estudiante'), 
('Carlos Gómez', 'carlos@uni.edu', 'profesor123', 'Profesor'),
('Lucía Fernández', 'lucia@uni.edu', 'lucia2025', 'Estudiante'),
('Mario Díaz', 'mario@uni.edu', 'mario2025', 'Profesor'),
('Sofía Torres', 'sofia@uni.edu', 'sofia123', 'Estudiante');

INSERT INTO libros (titulo, anio_publicacion, categoria) VALUES
('Bases de Datos Relacionales', '2015', 'Informática'),
('Algoritmos en C', '2010', 'Informática'),
('Historia de Roma', '2008', 'Historia'),
('Matemáticas Discretas', '2017', 'Matemáticas'),
('Literatura Española', '2020', 'Literatura');

INSERT INTO ejemplar (codigo_ejemplar, id_libro) VALUES
('INF-DB-001', 1),
('INF-DB-002', 1),
('INF-ALG-001', 2),
('HIS-ROM-001', 3),
('HIS-ROM-002', 3),
('MAT-DIS-001', 4),
('LIT-ESP-001', 5),
('LIT-ESP-002', 5);

INSERT INTO prestamos (id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista, fecha_dev_real) VALUES
-- Activos (sin devolución real)
(1, 1, '2025-08-01', '2025-08-15', NULL), -- Ana tiene un libro activo
(2, 2, '2025-08-05', '2025-08-20', NULL), -- Carlos tiene un libro activo
(3, 3, '2025-08-10', '2025-08-25', NULL), -- Lucía tiene un libro activo
-- Devueltos
(1, 4, '2025-07-01', '2025-07-15', '2025-07-14'),
(4, 6, '2025-06-10', '2025-06-25', '2025-06-23'),
(2, 8, '2025-07-20', '2025-08-05', '2025-08-02');