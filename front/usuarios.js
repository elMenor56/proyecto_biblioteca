const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");
const userTipo = localStorage.getItem("tipo"); // 'Estudiante' o 'Profesor'

if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "index.html";
}

// Cargar usuarios
async function cargarUsuarios() {
    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        data.forEach(usuario => {
            const li = document.createElement("li");
            li.textContent = `${usuario.id_usuario} - ${usuario.nombre} (${usuario.tipo}) `;

            // Solo mostrar botón si es Profesor
            if (userTipo === "Profesor") {
                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.style.marginLeft = "10px";
                btnEliminar.addEventListener("click", async () => {
                    if (!confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`)) return;

                    try {
                        const resDelete = await fetch(`${API_URL}/usuarios/${usuario.id_usuario}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const dataDelete = await resDelete.json();

                        if (!resDelete.ok) throw new Error(dataDelete.error);
                        alert(dataDelete.message);
                        cargarUsuarios(); // recarga la lista
                    } catch (err) {
                        alert("Error al eliminar usuario: " + err.message);
                    }
                });
                li.appendChild(btnEliminar);
            }

            lista.appendChild(li);
        });
    } catch (err) {
        lista.innerHTML = `<li style="color:red">❌ ${err.message}</li>`;
    }
}

cargarUsuarios();
