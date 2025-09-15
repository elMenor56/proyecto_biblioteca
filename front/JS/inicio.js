// API base
const API_URL = 'http://localhost:3000/api';

// Elementos del DOM
const userInfoDiv = document.getElementById('userInfo');
const cerrarSesionBtn = document.getElementById('CerrarSesionBtn');
const librosDiv = document.getElementById('libros');

// Obtener datos del usuario desde localStorage
const userId = localStorage.getItem('usuarioId');
const userNombre = localStorage.getItem('usuarioNombre');
const userTipo = localStorage.getItem('usuarioTipo');

// Elementos para búsqueda
const buscarInput = document.getElementById('buscarInput');
const buscarBtn = document.getElementById('buscarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');

// Mostrar información del usuario
userInfoDiv.innerHTML = `
    <p>Bienvenido, ${userNombre} (${userTipo})</p>
`;

// Evento para cerrar sesión
cerrarSesionBtn.addEventListener('click', () => {
    localStorage.clear(); // Limpiar localStorage
    window.location.href = 'iniciar-sesion.html'; // Redirigir a login
});

// Función para cargar todos los libros con sus ejemplares
async function cargarLibros() {
    try {
        const response = await fetch(`${API_URL}/libros`);
        const libros = await response.json();

        librosDiv.innerHTML = ''; // Limpiar contenedor

        libros.forEach(libro => {
            // Si el libro tiene ejemplares, iterar sobre ellos
            if (libro.ejemplares_disponibles > 0) {
                librosDiv.innerHTML += `
                <div class="libro">
                    <h3>${libro.titulo}</h3>
                    <p>Ejemplares disponibles: ${libro.ejemplares_disponibles}</p>
                    <button onclick="pedirPrestamo(${userId}, ${libro.id_libro})">Pedir préstamo</button>
                </div>
                `;  
            } else {
                librosDiv.innerHTML += `
                    <div class="libro">
                        <h3>${libro.titulo}</h3>
                        <p>No hay ejemplares disponibles</p>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error('Error al cargar libros:', error);
    }
}

// Función para pedir un préstamo
async function pedirPrestamo(userId, idLibro) {
    try {
        const response = await fetch(`${API_URL}/prestamos/crear-por-libro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario: userId, id_libro: idLibro })
        });

        const resultado = await response.json();

        if (!resultado.success) {
            alert(resultado.message); // Ej. "No hay ejemplares disponibles"
            return;
        }

        // Actualizar libros y préstamos después de pedir uno
        cargarLibros();
        cargarPrestamos();
    } catch (error) {
        console.error('Error al pedir préstamo:', error);
    }
}

// Contenedor para préstamos activos
const prestamosDiv = document.createElement('div');
prestamosDiv.id = 'prestamosActivos';
document.body.appendChild(prestamosDiv);

// Función para cargar préstamos activos del usuario
async function cargarPrestamos() {
    try {
        const response = await fetch(`${API_URL}/prestamos/activos`);
        const prestamos = await response.json();

        // Filtrar solo los préstamos del usuario logueado
        const misPrestamos = prestamos.filter(p => p.id_usuario == userId);

        if (misPrestamos.length === 0) {
            prestamosDiv.innerHTML += '<p>No tienes préstamos activos.</p>';
            return;
        }

        misPrestamos.forEach(p => {
            prestamosDiv.innerHTML += `
            <div class="prestamo">
                <h4>${p.libro}</h4>
                <p><strong>Código ejemplar:</strong> ${p.codigo_ejemplar}</p>
                <p><strong>Fecha préstamo:</strong> ${new Date(p.fecha_prestamo).toLocaleDateString()}</p>
                <p><strong>Fecha devolución prevista:</strong> ${new Date(p.fecha_dev_prevista).toLocaleDateString()}</p>
                <button onclick="devolverPrestamo(${p.id_prestamo})">Devolver</button>
            </div>
        `;
});
    } catch (error) {
        console.error('Error al cargar préstamos:', error);
    }
}

// Inicialización: cargar libros y préstamos al abrir la página
cargarLibros();
cargarPrestamos();

// Función para devolver un préstamo
async function devolverPrestamo(idPrestamo) {
    try {
        // Se puede enviar la fecha actual como fecha de devolución
        const fechaDevReal = new Date().toISOString().split('T')[0];

        const response = await fetch(`${API_URL}/prestamos/devolver/${idPrestamo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha_dev_real: fechaDevReal })
        });

        const resultado = await response.json();

        if(resultado.success) {
            // 🔹 Actualizar libros y préstamos después de devolver uno
            cargarLibros();
            cargarPrestamos();
        } else {
            console.error(resultado.message);
        }
    } catch (error) {
        console.error('Error al devolver préstamo:', error);
    }
}

// Evento para buscar
buscarBtn.addEventListener('click', async () => {
    const filtro = buscarInput.value.trim();
    if(filtro === '') return;

    try {
        // Usamos tu ruta con :filtro
        const response = await fetch(`${API_URL}/libros/buscar/${encodeURIComponent(filtro)}`);
        const libros = await response.json();
        mostrarLibros(libros); // Reutilizamos la función de renderizado
    } catch (error) {
        console.error('Error al buscar libros:', error);
    }
});

//Evento para limpiar la busqueda
limpiarBtn.addEventListener('click', () => {
    buscarInput.value = '';
    cargarLibros(); // Vuelve a cargar todos los libros
});

// Función para mostrar libros (adaptamos la existente)
function mostrarLibros(libros) {
    librosDiv.innerHTML = '';

    libros.forEach(libro => {
        librosDiv.innerHTML += `
            <div class="libro">
                <h3>${libro.titulo}</h3>
                <p><strong>Categoría:</strong> ${libro.categoria}</p>
                <p><strong>Año:</strong> ${libro.anio_publicacion}</p>
                <p><strong>Ejemplares disponibles:</strong> ${libro.ejemplares_disponibles ?? 0}</p>
                <button ${libro.ejemplares_disponibles === 0 ? 'disabled' : ''} 
                        onclick="pedirPrestamo(${userId}, ${libro.id_libro})">
                    Pedir préstamo
                </button>
            </div>
        `;
    });
}