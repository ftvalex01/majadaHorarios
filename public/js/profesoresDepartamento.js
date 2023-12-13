document.addEventListener('DOMContentLoaded', async function () {
    const TokenDocente = sessionStorage.getItem('token');
    let url = window.location.pathname;
    let parts = url.split('/');
    const idDepartamento = parts[2];



    async function loadProfesoresPorDepartamento(idDepartamento) {
        try {
            const response = await fetch(`http://majadahorarios.test/api/v1/departamentos/${idDepartamento}/profesores`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudieron obtener los profesores del departamento');
            }
            // url = window.location.pathname;
            // parts = url.split('/');
            // const idProfesor = parts[3];
            const { profesores } = await response.json();
            console.log(profesores);

            const profesoresListElement = document.getElementById('profesoresList');
            profesoresListElement.innerHTML = '';

            profesores.forEach(profesor => {
                const tarjetaProfesor = crearTarjetaProfesor(profesor);
                profesoresListElement.appendChild(tarjetaProfesor);
                console.log(JSON.stringify(profesor, null, 2) + "profesor");
                tarjetaProfesor.querySelector('.ver-detalles').addEventListener('click', function () {
                    // Mostrar los detalles del profesor en el modal
                    console.log("profesor modal info" + profesor)
                    const nombreProfesor = profesor.name;
                    const email = profesor.email;
                    const rol = profesor.rol;
                    document.getElementById('nombreProfesor').textContent = `Nombre: ${nombreProfesor}`;
                    document.getElementById('email').textContent = `Email: ${email}`;
                    document.getElementById('rol').textContent = `Rol: ${rol}`;

                    const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
                    modal.show();
                });

                // Agregar evento click al botón "Ver Horario"
                tarjetaProfesor.querySelector('.ver-horario').addEventListener('click', async function () {
                    let profesorId = profesor.id;

                    try {
                        const response = await fetch(`http://majadahorarios.test/api/v1/departamentos/${idDepartamento}/profesores/${profesorId}/modulos`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${TokenDocente}`
                            }
                        });

                        if (!response.ok) {
                            throw new Error('No se pudo obtener el horario del profesor');
                        }

                        const horarioProfesor = await response.json();
                        console.log("modulo modal info" + JSON.stringify(horarioProfesor, null, 2));

                        // Mostrar información de todos los módulos
                        if (Array.isArray(horarioProfesor) && horarioProfesor.length > 0) {
                            let infoModulos = '';
                            for (let i = 0; i < horarioProfesor.length; i++) {
                                const modulo = horarioProfesor[i];
                                const nombreModulo = modulo.materia;
                                const distribucionHoraria = modulo.distribucion_horas;

                                // Aquí puedes hacer lo que desees con la información del módulo
                                // Por ejemplo, puedes mostrarla en un elemento HTML
                                infoModulos += `Módulo ${i + 1}: Nombre - ${nombreModulo}, Horario - ${distribucionHoraria}<br>`;
                            }

                            // Mostrar la información de todos los módulos en un elemento HTML
                            document.getElementById('nombreProfesor').innerHTML = `Información de los módulos:<br>${infoModulos}`;

                            const modal = new bootstrap.Modal(document.getElementById('profesorModal'));
                            modal.show();
                        }
                    } catch (error) {
                        console.error('Error al obtener el horario del profesor:', error);
                        // Manejo de errores
                    }
                });
            });
        } catch (error) {
            console.error('Error al obtener profesores del departamento:', error);
            // Manejo de errores
        }
    }

    loadProfesoresPorDepartamento(idDepartamento);
});

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
                        <button type="button" class="btn btn-sm btn-outline-secondary ver-horario">Ver Horario</button>
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

document.getElementById('logoutButton').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = '../../index.html';
});