const API_URL = "http://localhost:3000";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");

    try {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en login");

    localStorage.setItem("token", data.token);
    msg.textContent = "✅ Bienvenido " + data.usuario.nombre;
    msg.style.color = "green";

    setTimeout(() => { window.location.href = "libros.html"; }, 1000);
    } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
    }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("regNombre").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const tipo = document.getElementById("regTipo").value;
    const msg = document.getElementById("registerMsg");

    try {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, tipo })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en registro");

    msg.textContent = "✅ Usuario registrado correctamente";
    msg.style.color = "green";
    } catch (err) {
    msg.textContent = "❌ " + err.message;
    msg.style.color = "red";
    }
});