// Este bloque se ejecuta cuando el contenido del DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", function () {
    // Obtener datos del usuario y el token del almacenamiento de sesión.
    const userData = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
    const TokenDocente = sessionStorage.getItem("token");

    // Referencias a elementos del DOM.
    const departamentoSelect = document.getElementById("departamento_id");
    const especialidadSelect = document.getElementById("especialidad_id");
    const userForm = document.getElementById("userForm");

    // Agregar enlaces de navegación basados en el rol del usuario.
    const navbarDiv = document.querySelector(
        ".collapse.navbar-collapse.justify-content-end#navbarNav"
    );
    if (
        userData.rol === "jefe_departamento" ||
        userData.rol === "jefe_estudios"
    ) {
        const links = [
            {
                href: "https://majadahorarios-app.onrender.com/jefeDeDepartamento",
                text: "Hoja de departamento",
            },
            {
                href: "https://majadahorarios-app.onrender.com/jefeDeEstudios",
                text: "Hoja de Jefe de Estudios",
            },
        ];
        if (userData.rol === "jefe_estudios") {
            links.push({
                href: "https://majadahorarios-app.onrender.com/admin",
                text: "Registro de Profesores",
            });
        }
        links.forEach((link) => {
            const newNavItem = document.createElement("li");
            newNavItem.classList.add("nav-item");
            const newLink = document.createElement("a");
            newLink.classList.add("nav-link");
            newLink.href = link.href;
            newLink.textContent = link.text;
            newNavItem.appendChild(newLink);
            navbarDiv
                .querySelector(".navbar-nav")
                .insertBefore(
                    newNavItem,
                    navbarDiv.querySelector("#logoutButton").parentNode
                );
        });
    }

    // Función para cargar especialidades desde la API.
    async function loadEspecialidades() {
        try {
            const response = await fetch(
                `https://majadahorarios-app.onrender.com/api/v1/especialidades`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                }
            );
            const jsonData = await response.json();
            especialidadSelect.innerHTML = jsonData.data
                .map(
                    (especialidad) =>
                        `<option value="${especialidad.id}">${especialidad.nombre}</option>`
                )
                .join("");
        } catch (error) {
            console.error("Error al obtener especialidades:", error);
        }
    }

    // Función para cargar departamentos desde la API.
    async function loadDepartamentos() {
        try {
            const response = await fetch(
                `https://majadahorarios-app.onrender.com/api/v1/departamentos`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                }
            );
            const data = await response.json();
            departamentoSelect.innerHTML = data
                .map(
                    (depto) =>
                        `<option value="${depto.id}">${depto.nombre}</option>`
                )
                .join("");
        } catch (error) {
            console.error("Error al obtener departamentos:", error);
        }
    }

    // Manejar el envío del formulario de usuario.
    userForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validaciones del formulario.
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (!name) {
            Swal.fire("Error", "Por favor ingresa un nombre válido.", "error");
            return;
        }
        if (!email.includes("@")) {
            Swal.fire(
                "Error",
                "Por favor ingresa un correo electrónico válido.",
                "error"
            );
            return;
        }
        if (password.length < 8) {
            Swal.fire(
                "Error",
                "La contraseña debe tener al menos 8 caracteres.",
                "error"
            );
            return;
        }

        // Datos del formulario.
        const formData = {
            name,
            email,
            password,
            departamento_id: departamentoSelect.value,
            especialidad_id: especialidadSelect.value,
            rol: document.getElementById("rol").value,
        };

        // Enviar datos a la API.
        try {
            const response = await fetch(
                "https://majadahorarios-app.onrender.com/api/v1/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                    body: JSON.stringify(formData),
                }
            );
            const result = await response.json();
            if (response.ok) {
                Swal.fire(
                    "Éxito",
                    "Los datos se han enviado correctamente",
                    "success"
                );
                userForm.reset(); // Limpia el formulario.
            } else {
                Swal.fire("Error", "Hubo un error en el registro", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error en la solicitud: " + error, "error");
        }
    });

    // Cargar datos iniciales al cargar la página.
    loadDepartamentos();
    loadEspecialidades();
});

// Evento de clic para el botón de cerrar sesión.
document.getElementById("logoutButton").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "index.html";
});
