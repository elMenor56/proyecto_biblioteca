const API_URL = "http://localhost:3000/api";

const registroForm = document.getElementById("registroForm");
const mensajeDiv = document.getElementById("mensaje");

registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const contrasenia = document.getElementById("contrasenia").value;
    const tipo = document.getElementById("tipo").value;

    if (!tipo) {
        mostrarMensaje("Por favor selecciona un tipo de usuario", false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, contrasenia, tipo })
        });

    const data = await response.json();

    if (data.success) {
        mostrarMensaje("Registro exitoso. Redirigiendo al login...", true);
        setTimeout(() => {
            window.location.href = "iniciar-sesion.html";
        }, 1500);
    } else {
        mostrarMensaje(data.message, false);
    }

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        mostrarMensaje("Error al procesar el registro. Intenta nuevamente.", false);
    }
});

function mostrarMensaje(texto, esExito) {
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = "block";
    mensajeDiv.style.backgroundColor = esExito ? "#d4edda" : "#f8d7da";
    mensajeDiv.style.color = esExito ? "#155724" : "#721c24";
}