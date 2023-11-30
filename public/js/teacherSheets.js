   // Espera a que el DOM esté completamente cargado
   document.addEventListener('DOMContentLoaded', function () {
    // Obtén el nombre del usuario almacenado en la respuesta JSON
    const userName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '';

    // Muestra el nombre del usuario en el elemento con id "userName"
    document.getElementById('userName').innerText = userName;

    // Agrega un evento de clic al botón de logout
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Elimina el token y redirige al usuario al formulario de login
        localStorage.clear();
        window.location.href = 'index.html'; // Cambia la URL según tu estructura de rutas
    });
});