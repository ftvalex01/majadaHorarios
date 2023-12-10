document.addEventListener('DOMContentLoaded', function () {
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const TokenDocente = sessionStorage.getItem('token');

    document.getElementById('userName').innerText = userData.name || '';
    document.getElementById('teacher').innerText = 'Docente: ' + userData.name || '';
    document.getElementById('specialization').innerText = 'Especialización: ' + (userData.especialidad.nombre || '');
    document.getElementById('department').innerText = 'Departamento: ' + (userData.departamento.nombre || '');

    document.getElementById('logoutButton').addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    const selectedModules = new Set();
    const selectElements = document.getElementsByName('teacherModules');
    const distribucionSemanalElements = document.getElementsByName('distribucionSemanal');
    let data;

    async function cargarOpciones() {
        try {
            const response = await fetch('http://majadahorarios.test/api/v1/modulos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            data = await response.json();

            console.log(data);

            selectElements.forEach((selectElement, index) => {
                selectElement.innerHTML = '';

                const optionPlaceholder = document.createElement('option');
                optionPlaceholder.value = 'selectModule';
                optionPlaceholder.textContent = 'Selecciona Modulo';

                selectElement.appendChild(optionPlaceholder);

                data.data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.id;
                    optionElement.textContent = option.materia;
                    

                    // Si el módulo ya está seleccionado, deshabilita la opción
                    if (selectedModules.has(option.id)) {
                        optionElement.disabled = true;
                    }

                    selectElement.appendChild(optionElement);
                });
            });

            selectElements.forEach(selectElement => {
                selectElement.addEventListener('change', async function (event) {
                    const selectedOptionId = event.target.value;  // Cambio aquí

                    try {
                        const specificModuleData = await SelectSpecificModule(selectedOptionId);
                        const row = event.target.closest('tr');
                        const totalHoras = specificModuleData.data.h_semanales;

                        // Actualiza la columna "Horas" con las horas totales del módulo
                        
                        row.cells[0].innerText = capitalizeFirstLetter(specificModuleData.data.curso.turno);
                        row.cells[1].innerText = `Curso: ${specificModuleData.data.curso.nombre} - Ciclo: ${specificModuleData.data.curso.año}`;
                        row.cells[3].innerText = totalHoras;

                        // Llama a la función para generar las opciones de distribución
                        const opcionesDistribucion = generarOpcionesDistribucion(totalHoras);

                        // Muestra las opciones en el elemento select con id "distribucionSemanal"
                        const distribucionSemanalSelect = row.cells[4].querySelector('select');
                        distribucionSemanalSelect.innerHTML = '';

                        for (const opcion of opcionesDistribucion) {
                            const opcionElement = document.createElement('option');
                            opcionElement.value = opcion.join('+');
                            opcionElement.textContent = `(${opcion.join('+')})`;
                            distribucionSemanalSelect.appendChild(opcionElement);
                        }
                    } catch (error) {
                        console.error('Error al obtener datos del módulo específico:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    }

    async function SelectSpecificModule(selectModule) {
        return await fetch(`http://majadahorarios.test/api/v1/modulos/${selectModule}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TokenDocente}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }

    // Función para generar opciones de distribución semanal
    // Función para generar opciones de distribución semanal
    function generarOpcionesDistribucion(totalHoras) {
        const opciones = [];
        generarOpciones([], totalHoras, 5, opciones);
        return opciones;
    }

    // Función recursiva para generar todas las combinaciones posibles
    function generarOpciones(combActual, horasRestantes, diasRestantes, opciones) {
        // Si hemos utilizado todas las horas y no excede los días restantes, agregamos la combinación actual a las opciones
        if (horasRestantes === 0 && diasRestantes >= 0) {
            opciones.push([...combActual]);
            return;
        }

        // Intentamos agregar 1, 2 o 3 horas a la combinación actual y llamamos recursivamente
        for (let i = 1; i <= 3; i++) {
            // Verificamos que no exceda las horas restantes
            if (i <= horasRestantes) {
                combActual.push(i);
                // Si hemos usado menos de 5 días, continuamos llamando recursivamente
                if (diasRestantes > 0) {
                    generarOpciones(combActual, horasRestantes - i, diasRestantes - 1, opciones);
                }
                combActual.pop();
            }
        }
    }

    // Función para verificar si una distribución tiene más de 3 horas seguidas
    function tieneMasDeTresHorasSeguidas(distribucion) {
        let contador = 0;

        for (const horasSeguidas of distribucion) {
            if (horasSeguidas > 0) {
                contador++;
                if (contador > 3) {
                    return true;
                }
            } else {
                contador = 0;
            }
        }

        return false;
    }


    // Llama a la función para cargar las opciones al cargar la página
    cargarOpciones();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
