
let TokenDocente = sessionStorage.getItem('token');
if (!TokenDocente) {
    window.location.href = '../../index.html'; // Redirige al index si no hay un token
}
document.addEventListener('DOMContentLoaded', async function () {

    let url = window.location.pathname;
    let parts = url.split('/');
    const idDepartamento = parts[2];
    let sumas = [];

    const modal2 = new bootstrap.Modal(document.getElementById('modulosProfesorModal'));
    const modulosProfesorContent = document.getElementById('modulosProfesorContent');

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

                    let modal1 = new bootstrap.Modal(document.getElementById('profesorModal'));

                    modal1.show();
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

                        // Mostrar información de todos los módulos en un nuevo modal
                        if (Array.isArray(horarioProfesor) && horarioProfesor.length > 0) {
                            let infoModulos = '';
                            for (let i = 0; i < horarioProfesor.length; i++) {
                                // sumas = [];
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

                            // Mostrar información en el mismo modal
                            modulosProfesorContent.innerHTML = infoModulos;
                            // if (!sumatorioBool) {
                            // sumas = ["(1+1+1)", "(2+2+22)"];

                            sumatorioHoras = sumarDistribucionesHorarias(sumas);
                            console.log(sumatorioHoras + "sumatorioHoras")
                            let sumatorioElement = document.createElement('p');
                            sumatorioElement.textContent = `Sumatorio de Horas: ${sumatorioHoras}`;
                            sumas = [];
                            if (horarioProfesor.reduce((total, num) => total + parseInt(num.distribucion_horas), 0) >= 17 && horarioProfesor.reduce((total, num) => total + parseInt(num.distribucion_horas), 0) <= 20) {
                                sumatorioElement.style.color = "green";
                            } else {
                                sumatorioElement.style.color = "red";
                                let errorP = document.createElement("p");
                                errorP.innerText = "Debe cumplir un mínimo de 17 horas y un máximo de 20";
                                sumatorioElement.appendChild(errorP);
                            }
                            modulosProfesorContent.appendChild(sumatorioElement);
                            sumatorioBool = true;
                            // }

                            // Mostrar el modal
                            modal2.show();
                        }
                        else {
                            let infoModulos = '';

                            infoModulos += `
                                    <div class = "cardModalInfoModulos">
                                        <p>Este profesor no tiene asignado ningún modulo por el momento.</p>
                                    </div>
                                `;

                            modulosProfesorContent.innerHTML = infoModulos;
                            modal2.show();

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
function sumarDistribucionesHorarias(distribuciones) {
    let sumaTotal = 0;

    distribuciones.forEach(distribucion => {
        // Elimina los paréntesis y divide los números por '+'
        const numeros = distribucion.slice(1, -1).split('+');

        // Suma los números convertidos a enteros
        const sumaNumeros = numeros.reduce((total, num) => {
            const numero = parseInt(num);
            return total + numero;
        }, 0);

        // Agrega la suma de la distribución al total
        sumaTotal += sumaNumeros;
    });

    return sumaTotal;
}

document.getElementById('logoutButton').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = '../../index.html';
});