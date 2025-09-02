CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
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

INSERT INTO usuarios (nombre, email, password, tipo) VALUES
('Ana López', 'ana@uni.edu', '$2b$10$C2B5fDEoE9.l9Pz3QdazMefw2cjhTdgU8ylk6B9hZ.Dc9kVY6y3Qy', 'Estudiante'), 
('Carlos Gómez', 'carlos@uni.edu', '$2b$10$SgLHT4dDDf5nPX3q3gcf1OZml1TACcP3lUu.R3sRzjLDPq1m1cI7G', 'Profesor'),
('Lucía Fernández', 'lucia@uni.edu', '$2b$10$LkjN3dseV6PpC5.4J.Qe7uPEwYgSpu4BpxhW9VgqK5thMmrS1h6x6', 'Estudiante'),
('Mario Díaz', 'mario@uni.edu', '$2b$10$Wv4s8sj8F8c5XYoYpOtCseId6HqVwX8hE6k5U8ME9E7mNcRklz9uq', 'Profesor'),
('Sofía Torres', 'sofia@uni.edu', '$2b$10$Qn/1o6yEo5AcNQwIksU8cOxC6AjqIlN6kAg06S3h8IuFV6u4L1m2G', 'Estudiante');

INSERT INTO libros (titulo, anio_publicacion, categoria) VALUES
('Bases de Datos Relacionales', 2015, 'Informática'),
('Algoritmos en C', 2010, 'Informática'),
('Historia de Roma', 2008, 'Historia'),
('Matemáticas Discretas', 2017, 'Matemáticas'),
('Literatura Española', 2020, 'Literatura');

INSERT INTO ejemplar (codigo_ejemplar, id_libro) VALUES
('INF-DB-001', 1),
('INF-DB-002', 1),
('INF-ALG-001', 2),
('HIS-ROM-001', 3),
('HIS-ROM-002', 3),
('MAT-DIS-001', 4),
('LIT-ESP-001', 5),
('LIT-ESP-002', 5);

INSERT INTO Prestamos (id_usuario, id_ejemplar, fecha_prestamo, fecha_dev_prevista, fecha_dev_real) VALUES
-- Activos (sin devolución real)
(1, 1, '2025-08-01', '2025-08-15', NULL), -- Ana tiene un libro activo
(2, 3, '2025-08-05', '2025-08-20', NULL), -- Carlos tiene un libro activo
(3, 7, '2025-08-10', '2025-08-25', NULL), -- Lucía tiene un libro activo
-- Devueltos
(1, 4, '2025-07-01', '2025-07-15', '2025-07-14'),
(4, 6, '2025-06-10', '2025-06-25', '2025-06-23'),
(2, 2, '2025-07-20', '2025-08-05', '2025-08-02');

-- Contraseñas reales de estos hashes
--Ana López → 123456
--Carlos Gómez → profesor123
--Lucía Fernández → lucia2025
--Mario Díaz → mario2025
--Sofía Torres → sofia123