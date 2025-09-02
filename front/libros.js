const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "index.html";
}

async function cargarLibros() {
    const lista = document.getElementById("listaLibros");
    lista.innerHTML = "";

    try {
    const res = await fetch(`${API_URL}/libros`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    data.forEach(libro => {
        const li = document.createElement("li");
        li.textContent = `${libro.titulo} (${libro.anio_publicacion}) - ${libro.categoria}`;
        lista.appendChild(li);
    });
    } catch (err) {
        lista.innerHTML = `<li style="color:red">❌ ${err.message}</li>`;
    }
}

document.getElementById("addLibroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const anio_publicacion = document.getElementById("anio").value;
    const categoria = document.getElementById("categoria").value;
    const msg = document.getElementById("libroMsg");

    try {
    const res = await fetch(`${API_URL}/libros`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, anio_publicacion, categoria })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    msg.textContent = "✅ Libro agregado con éxito";
    msg.style.color = "green";
    cargarLibros();
    } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
    }
});

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

cargarLibros();