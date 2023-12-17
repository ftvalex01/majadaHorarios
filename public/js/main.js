// Validación del formulario

document
    .getElementById("professorsForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        // Limpiar mensajes de error anteriores
        document.getElementById("email-error").textContent = "";
        document.getElementById("password-error").textContent = "";

        // Obtener valores del formulario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Validación del email
        if (!validateEmail(email)) {
            document.getElementById("email-error").textContent =
                "Por favor, introduce un email válido.";
            return;
        }

        // Validación de la longitud de la contraseña
        if (password.length < 8) {
            document.getElementById("password-error").textContent =
                "La contraseña debe tener al menos 8 caracteres.";
            return;
        }

        // Si todo es válido, realiza la petición al servidor
        fetch("https://majadahorarios-app.onrender.com/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    sessionStorage.setItem("token", data.data.token);
                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(data.data.user)
                    );
                    window.location.href = "teacherSheets";
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

// Función para validar un email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
}

// Evento de cambio de tema
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
});
