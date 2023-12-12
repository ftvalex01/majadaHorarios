document.addEventListener('DOMContentLoaded', async function () {
    const TokenDocente = sessionStorage.getItem('token');

    try {
        // Realizar la solicitud para obtener todos los profesores desde tu API o backend
        const response = await fetch(`http://majadahorarios.test/api/v1/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TokenDocente}`
            }
        });
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de profesores');
        }

        // Convertir la respuesta a formato JSON
        const profesoresData = await response.json();
        console.log(profesoresData);
        
        const contenedorProfesores = document.querySelector('.row');

        // Función para crear una tarjeta de profesor
        function crearTarjetaProfesor(profesor) {
            const card = document.createElement('div');
            card.classList.add('col-md-4');

            card.innerHTML = `
                <div class="card mb-4 box-shadow">
                    <!-- Contenido de la tarjeta -->
                    <div class="card-body">
                        <!-- Nombre del profesor -->
                        <h5 class="card-title">${profesor.name}</h5>
                        <img class="card-img-top" src="https://cdn.dribbble.com/users/760319/screenshots/3907189/man.png?resize=400x0" alt="Imagen del profesor">
                        <!-- Botones -->
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-primary ver-detalles">Ver Detalles</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary">Ver Horario</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Agregar dataset con la información del profesor
            const detallesProfesor = JSON.stringify(profesor);
            card.querySelector('.ver-detalles').dataset.profesor = detallesProfesor;

            return card;
        }

        // Mostrar las tarjetas de todos los profesores
        profesoresData.data.forEach(profesor => {
            const tarjetaProfesor = crearTarjetaProfesor(profesor);
            contenedorProfesores.appendChild(tarjetaProfesor);

            tarjetaProfesor.querySelector('.ver-detalles').addEventListener('click', function () {
                // Mostrar los detalles del profesor en el modal
                const nombreProfesor = profesor.name;
                const email = profesor.email; // Reemplaza 'otroDato' con el campo que desees mostrar
                const rol = profesor.rol;
                document.getElementById('nombreProfesor').textContent = `Nombre: ${nombreProfesor}`;
                document.getElementById('email').textContent = `Email: ${email}`;
                document.getElementById('rol').textContent = `Rol: ${rol}`;

                const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
                modal.show();
            });
        });

    } catch (error) {
        console.error('Error al obtener la lista de profesores:', error);
        // Manejo de errores (puedes mostrar un mensaje de error o realizar alguna acción apropiada)
    }
});

document.getElementById('logoutButton').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = 'index.html';
});
