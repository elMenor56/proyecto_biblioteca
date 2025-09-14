const API_URL = "http://localhost:3000/api";

// Obtener datos del usuario desde localStorage
const userId = localStorage.getItem("usuarioId");
const userNombre = localStorage.getItem("usuarioNombre");
const userTipo = localStorage.getItem("usuarioTipo");

// Si no hay sesión → redirigir al login
if (!userId) {
    window.location.href = "iniciar-sesion.html";
}

// Mostrar info del usuario
document.getElementById("userInfo").innerText = `Hola, ${userNombre} (${userTipo})`;

// Función para cerrar sesión
document.getElementById("CerrarSesionBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioCorreo");
    localStorage.removeItem("usuarioTipo");

    window.location.href = "iniciar-sesion.html";
});