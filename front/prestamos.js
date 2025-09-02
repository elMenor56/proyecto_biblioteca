const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "index.html";
}

// Cargar préstamos activos
async function cargarPrestamos() {
    const lista = document.getElementById("listaPrestamos");
    lista.innerHTML = "";

    try {
        const res = await fetch(`${API_URL}/prestamos`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        data.forEach(prestamo => {
            const li = document.createElement("li");
            li.textContent = `Préstamo #${prestamo.id_prestamo} | Usuario: ${prestamo.id_usuario} | Ejemplar: ${prestamo.id_ejemplar} | Previsto: ${prestamo.fecha_dev_prevista} | Devuelto: ${prestamo.fecha_dev_real ?? "Pendiente"}`;
            lista.appendChild(li);
        });
    } catch (err) {
        lista.innerHTML = `<li style="color:red">❌ ${err.message}</li>`;
    }
}

// Registrar préstamo
document.getElementById("addPrestamoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id_usuario = document.getElementById("id_usuario").value;
    const id_ejemplar = document.getElementById("id_ejemplar").value;
    const fecha_dev_prevista = document.getElementById("fecha_dev_prevista").value;
    const msg = document.getElementById("prestamoMsg");

    try {
        const res = await fetch(`${API_URL}/prestamos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id_usuario, id_ejemplar, fecha_dev_prevista })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    msg.textContent = "✅ Préstamo registrado con éxito";
    msg.style.color = "green";
    cargarPrestamos();
    } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
    }
});

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

cargarPrestamos();
