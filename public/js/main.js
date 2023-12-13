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
        if (data.status === 'success') {
            // Cambiado de localStorage a sessionStorage
           
            sessionStorage.setItem('token', data.data.token);
            sessionStorage.setItem('user', JSON.stringify(data.data.user));
            
            window.location.href = 'teacherSheets';
          
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});