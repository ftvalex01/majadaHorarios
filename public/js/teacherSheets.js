document.addEventListener('DOMContentLoaded', function () {
    // Obtén la información del usuario almacenada en la respuesta JSON
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};

    // Muestra el nombre del usuario en el elemento con id "userName"
    document.getElementById('userName').innerText = userData.name || '';
    document.getElementById('teacher').innerText = 'Docente: ' + userData.name || '';

    // Muestra la especialidad del usuario en el elemento con id "specialization"
    document.getElementById('specialization').innerText = 'Especialización: ' + (userData.especialidad.nombre || '');

    // Muestra el departamento del usuario en el elemento con id "department"
    document.getElementById('department').innerText = 'Departamento: ' + (userData.departamento.nombre || '');

    // Agrega un evento de clic al botón de logout
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Elimina el token y redirige al usuario al formulario de login
        sessionStorage.clear();
        window.location.href = 'index.html'; // Cambia la URL según tu estructura de rutas
    });
});
