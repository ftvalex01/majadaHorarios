document.addEventListener('DOMContentLoaded', async function () {
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const TokenDocente = sessionStorage.getItem('token');
    const sumas = [];
    // Aquí deberías tener la lógica para obtener el ID del departamento del usuario loggeado
    const idDepartamentoUsuarioLoggeado = userData.departamento_id; // Reemplaza 'departamento_id' con la clave correcta de tu objeto de usuario

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
        console.log(profesoresData)
        // Filtrar profesores por el mismo ID de departamento del usuario loggeado
        const profesoresMismoDepartamento = profesoresData.data.filter(profesor => profesor.departamento_id === idDepartamentoUsuarioLoggeado);
        console.log(profesoresMismoDepartamento)
        // Obtener el contenedor donde se mostrarán las tarjetas de profesores
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


        // Mostrar las tarjetas de profesores del mismo departamento
        profesoresMismoDepartamento.forEach(profesor => {
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

            tarjetaProfesor.querySelector('.ver-horario').addEventListener('click', async function () {
                let profesorId = profesor.id;

                try {
                    const response = await fetch(`http://majadahorarios.test/api/v1/departamentos/${idDepartamentoUsuarioLoggeado}/profesores/${profesorId}/modulos`, {
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

                    // Mostrar información de todos los módulos en un nuevo modal
                    if (Array.isArray(horarioProfesor) && horarioProfesor.length > 0) {
                        let infoModulos = '';
                        for (let i = 0; i < horarioProfesor.length; i++) {
                            const modulo = horarioProfesor[i];
                            const nombreModulo = modulo.materia;
                            const distribucionHoraria = modulo.distribucion_horas;
                            sumas.push(modulo.distribucion_horas);
                            console.log(sumas + "sumas");
                            // Aquí puedes hacer lo que desees con la información del módulo
                            // Por ejemplo, puedes construir una estructura HTML para mostrar la información
                            infoModulos += `
                                <div class = "cardModalInfoModulos">
                                    <h6>Información del Módulo ${i + 1}</h6>
                                    <p>Nombre: ${nombreModulo}</p>
                                    <p>Distribución Horaria: ${distribucionHoraria}</p>
                                </div>
                            `;
                        }



                        // Mostrar la información de todos los módulos en un nuevo modal
                        document.getElementById('modulosProfesorContent').innerHTML = infoModulos;
                        let modal2 = new bootstrap.Modal(document.getElementById('modulosProfesorModal'));

                        modal2.show();

                        let sumatorioHoras = sumarSumas(sumas);
                        let sumatorioElement = document.createElement('p');
                        sumatorioElement.textContent = `Sumatorio de Horas: ${sumatorioHoras}`;
                        document.getElementById('modulosProfesorContent').appendChild(sumatorioElement);
                    }
                } catch (error) {
                    console.error('Error al obtener el horario del profesor:', error);
                    // Manejo de errores
                }
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

function sumarSumas(sumas) {
    let resultado = [];

    sumas.forEach(suma => {
        const numeros = suma.split('+');

        const sumaNumeros = numeros.reduce((total, num) => {
            const numero = parseInt(num);
            return total + numero;
        }, 0);

        resultado.push(sumaNumeros);
    });

    const sumaTotal = resultado.reduce((total, num) => total + num, 0);

    return sumaTotal;
}
