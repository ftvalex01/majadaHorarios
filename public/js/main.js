document.getElementById('professorsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtén los datos del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Realiza una petición POST al servidor
    fetch('http://majadahorarios.test/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Manejar la respuesta del servidor
        if (data.status === 'success') {
            // Almacenar el token en el localStorage o en las cookies según tu aplicación
            localStorage.setItem('token', data.data.token); // CAMBIAR A SESSION
            
            // Redirigir a otra página o realizar otras acciones después de iniciar sesión
            window.location.href = 'teacherSheets'; // Cambia la URL según tu estructura de rutas
        } else {
            // Mostrar mensaje de error u otras acciones en caso de fallo
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
