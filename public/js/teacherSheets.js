document.addEventListener('DOMContentLoaded', async function () {
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

    const selectedModules = new Set(userData.selectedModules || []);

    const selectElements = document.getElementsByName('teacherModules');

    async function cargarOpciones() {
        try {
            const response = await fetch('http://majadahorarios.test/api/v1/modulos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }
    
            const data = await response.json();

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

                    if (selectedModules.has(option.id)) {
                        optionElement.disabled = true;
                    }

                    selectElement.appendChild(optionElement);
                });
            });

            selectElements.forEach(selectElement => {
                selectElement.addEventListener('change', async function (event) {
                    const selectedOptionId = event.target.value;

                    if (selectedOptionId === 'selectModule') {
                        const row = event.target.closest('tr');

                        row.cells[0].innerText = '';
                        row.cells[1].innerText = '';
                        row.cells[3].innerText = '';

                        const distribucionSemanalSelect = row.cells[4].querySelector('select');
                        distribucionSemanalSelect.innerHTML = '';

                        const aulaSelectElement = row.cells[5].querySelector('select');
                        aulaSelectElement.innerHTML = '';

                        selectElements.forEach((otherSelectElement) => {
                            if (otherSelectElement !== selectElement) {
                                Array.from(otherSelectElement.options).forEach((option) => {
                                    option.disabled = false;
                                });
                            }
                        });

                        return;
                    }

                    try {
                        const specificModuleData = await SelectSpecificModule(selectedOptionId);
                        const row = event.target.closest('tr');
                        const totalHoras = specificModuleData.data.h_semanales;

                        row.cells[0].innerText = capitalizeFirstLetter(specificModuleData.data.curso.turno);
                        row.cells[1].innerText = `Curso: ${specificModuleData.data.curso.nombre} - Ciclo: ${specificModuleData.data.curso.año}`;
                        row.cells[3].innerText = totalHoras;

                        const distribucionSemanalSelect = row.cells[4].querySelector('select');
                        distribucionSemanalSelect.innerHTML = '';

                        const opcionesDistribucion = generarOpcionesDistribucion(totalHoras);

                        for (const opcion of opcionesDistribucion) {
                            const opcionElement = document.createElement('option');
                            opcionElement.value = opcion.join('+');
                            opcionElement.textContent = `(${opcion.join('+')})`;
                            distribucionSemanalSelect.appendChild(opcionElement);
                        }

                        // Cargar las aulas
                        const aulaSelectElement = row.cells[5].querySelector('select');
                        await cargarAulas(selectedOptionId, aulaSelectElement);

                        selectElements.forEach((otherSelectElement) => {
                            if (otherSelectElement !== selectElement) {
                                Array.from(otherSelectElement.options).forEach((option) => {
                                    if (option.value === selectedOptionId) {
                                        option.disabled = true;
                                    }
                                });
                            }
                        });
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

    async function cargarAulas(moduloId, aulaSelectElement) {
        try {
            const response = await fetch(`http://majadahorarios.test/api/v1/modulos/${moduloId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            const data = await response.json();

            console.log(data);

            // Limpiar opciones anteriores
            aulaSelectElement.innerHTML = '';

            if (data.data.aulas && data.data.aulas.length > 0) {
                // Agregar opciones de aulas
                data.data.aulas.forEach(aula => {
                    const optionElement = document.createElement('option');
                    optionElement.value = aula.id;
                    optionElement.textContent = aula.nombre;
                    aulaSelectElement.appendChild(optionElement);
                });
            } else {
                // No hay aulas disponibles
                const optionElement = document.createElement('option');
                optionElement.textContent = 'No hay aulas disponibles';
                aulaSelectElement.appendChild(optionElement);
            }
        } catch (error) {
            console.error('Error al obtener datos de las aulas:', error);
        }
    }

    function generarOpcionesDistribucion(totalHoras) {
        const opciones = [];
        generarOpciones([], totalHoras, 5, opciones);
        return opciones;
    }

    function generarOpciones(combActual, horasRestantes, diasRestantes, opciones) {
        if (horasRestantes === 0 && diasRestantes >= 0) {
            opciones.push([...combActual]);
            return;
        }

        for (let i = 1; i <= 3; i++) {
            if (i <= horasRestantes) {
                combActual.push(i);
                if (diasRestantes > 0) {
                    generarOpciones(combActual, horasRestantes - i, diasRestantes - 1, opciones);
                }
                combActual.pop();
            }
        }
    }

    await cargarOpciones();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
