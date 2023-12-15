

document.addEventListener('DOMContentLoaded', function () {
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const TokenDocente = sessionStorage.getItem('token');
    const departamentoSelect = document.getElementById('departamento_id');
    const especialidadSelect = document.getElementById('especialidad_id');
    const userForm = document.getElementById('userForm');
    const messageDiv = document.getElementById('message');
    // Check user role and update navbar links accordingly
    const navbarDiv = document.querySelector('.collapse.navbar-collapse.justify-content-end#navbarNav');
    if (userData.rol === "jefe_departamento" || userData.rol === "jefe_estudios") {
        const links = [
            {
                href: 'http://majadahorarios.test/jefeDeDepartamento',
                text: 'Hoja de departamento'
            },
            {
                href: 'http://majadahorarios.test/jefeDeEstudios',
                text: 'Hoja de Jefe de Estudios'
            }
        ];
        if (userData.rol === "jefe_estudios") {
            // Agrega un enlace adicional para el jefe de estudios
            links.push({
                href: 'http://majadahorarios.test/admin',
                text: 'Registro de Profesores'
            });
        }
    
        links.forEach(link => {
            const newNavItem = document.createElement('li');
            newNavItem.classList.add('nav-item');
            const newLink = document.createElement('a');
            newLink.classList.add('nav-link');
            newLink.href = link.href;
            newLink.textContent = link.text;
            newNavItem.appendChild(newLink);
            navbarDiv.querySelector('.navbar-nav').insertBefore(newNavItem, navbarDiv.querySelector('#logoutButton').parentNode);
        });
    }

// Fetch especialidades
async function loadEspecialidades() {
    return await fetch(`http://majadahorarios.test/api/v1/especialidades`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TokenDocente}`,
        }
    })
    .then(response => response.json())
    .then(jsonData => {

        especialidadSelect.innerHTML = jsonData.data.map(especialidad => `<option value="${especialidad.id}">${especialidad.nombre}</option>`).join('');
    })
    .catch(error => {
        console.error('Error al obtener especialidades:', error);
    });
}
 
// Fetch departamentos
async function loadDepartamentos() {
    return await fetch(`http://majadahorarios.test/api/v1/departamentos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TokenDocente}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        departamentoSelect.innerHTML = data.map(depto => `<option value="${depto.id}">${depto.nombre}</option>`).join('');
    })    
    .catch(error => {
        console.error('Error al obtener departamentos:', error);
    });
}


// Manejar el envío del formulario
userForm.addEventListener('submit', async function (e) {
    e.preventDefault();


       // Validaciones
       const name = document.getElementById('name').value;
       const email = document.getElementById('email').value;
       const password = document.getElementById('password').value;



       if(!name){
        Swal.fire('Error', 'Por favor ingresa un nombre  válido.', 'error');
           document.getElementById('email').focus();
           return;
       }
       if (!email.includes('@')) {
           Swal.fire('Error', 'Por favor ingresa un correo electrónico válido.', 'error');
           document.getElementById('email').focus();
           return;
       }
   
       if (password.length < 8) {
           Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres.', 'error');
           document.getElementById('password').focus();
           return;
       }
   
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        departamento_id: departamentoSelect.value,
        especialidad_id: especialidadSelect.value,
        rol: document.getElementById('rol').value,
    };


    try {
        const response = await fetch('http://majadahorarios.test/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TokenDocente}`, // Si es necesario
            },
            
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Los datos se han enviado correctamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            userForm.reset(); // Limpia el formulario
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error en el registro',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Error en la solicitud: ' + error,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
});


    // Cargar opciones de departamento y especialidad al cargar la página
    loadDepartamentos();
    loadEspecialidades();
});
  // Logout button event listener
  document.getElementById('logoutButton').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = 'index.html';
});