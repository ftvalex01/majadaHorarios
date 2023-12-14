document.addEventListener('DOMContentLoaded', async function () {
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const TokenDocente = sessionStorage.getItem('token');
    let moduloId = null;

    document.getElementById('userName').innerText = userData.name || '';
    document.getElementById('teacher').innerText = 'Docente: ' + userData.name || '';
    document.getElementById('specialization').innerText = 'Especialización: ' + (userData.especialidad.nombre || '');
    document.getElementById('department').innerText = 'Departamento: ' + (userData.departamento.nombre || '');

    function updateTotalHours() {
        const totalHoursCell = document.getElementById('totalHorasCell');
        const guardarButton = document.getElementById('guardarButton');
        const totalHours = Array.from(document.querySelectorAll('td:nth-child(4)'))
            .map(td => parseInt(td.innerText) || 0)
            .reduce((acc, curr) => acc + curr, 0);

        totalHoursCell.innerText = totalHours;

        if (totalHours >= 17 && totalHours <= 20) {
            totalHoursCell.style.backgroundColor = 'green';
            totalHoursCell.style.color = 'white';
            guardarButton.disabled = false;
        } else {
            totalHoursCell.style.backgroundColor = 'red';
            totalHoursCell.style.color = 'white';
            guardarButton.disabled = true;
        }
    }

    if (userData.rol === "jefe_departamento") {
        const navbarDiv = document.querySelector('.collapse.navbar-collapse.justify-content-end#navbarNav');

        // Crear un nuevo elemento li
        const newNavItem = document.createElement('li');
        newNavItem.classList.add('nav-item');

        // Crear un enlace dentro del nuevo elemento li
        const newLink = document.createElement('a');
        newLink.classList.add('nav-link');
        newLink.href = 'http://majadahorarios.test/jefeDeDepartamento';
        newLink.textContent = 'Hoja de departamento';

        // Agregar el enlace al elemento li
        newNavItem.appendChild(newLink);

        // Obtener el botón de logout
        const logoutButton = navbarDiv.querySelector('#logoutButton');

        // Insertar el nuevo elemento li antes del botón de logout
        navbarDiv.querySelector('.navbar-nav').insertBefore(newNavItem, logoutButton.parentNode);
    }else if (userData.rol === "jefe_estudios") {
        const navbarDiv = document.querySelector('.collapse.navbar-collapse.justify-content-end#navbarNav');

        // Crear un nuevo elemento li
        const newNavItem1 = document.createElement('li');
        newNavItem1.classList.add('nav-item');

        // Crear un enlace dentro del nuevo elemento li
        const newLink1 = document.createElement('a');
        newLink1.classList.add('nav-link');
        newLink1.href = 'http://majadahorarios.test/jefeDeDepartamento';
        newLink1.textContent = 'Hoja de departamento';

        // Agregar el enlace al elemento li
        newNavItem1.appendChild(newLink1);

        const newNavItem2 = document.createElement('li');
        newNavItem2.classList.add('nav-item');

        // Crear un enlace dentro del nuevo elemento li
        const newLink2 = document.createElement('a');
        newLink2.classList.add('nav-link');
        newLink2.href = 'http://majadahorarios.test/jefeDeEstudios';
        newLink2.textContent = 'Hoja de Jefe de Estudios';

        // Agregar el enlace al elemento li
        newNavItem2.appendChild(newLink2);

        // Obtener el botón de logout
        const logoutButton = navbarDiv.querySelector('#logoutButton');

        // Insertar el nuevo elemento li antes del botón de logout
        navbarDiv.querySelector('.navbar-nav').insertBefore(newNavItem1, logoutButton.parentNode);
        navbarDiv.querySelector('.navbar-nav').insertBefore(newNavItem2, logoutButton.parentNode);

    }

    document.getElementById('logoutButton').addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    const selectedModules = new Set(userData.selectedModules || []);
    const selectElements = document.getElementsByName('teacherModules');
    let selectedModulesData = [];

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
                        const moduleHours = parseInt(row.cells[3].innerText) || 0;
                        subtractModuleHours(moduleHours);

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

                        // Remove the module data from the array when deselected
                        selectedModulesData = selectedModulesData.filter(data => data.moduloId !== selectedOptionId);

                        updateTotalHours();

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

                        // Add the module data to the array when selected
                        const moduleData = {
                            moduloId: selectedOptionId,
                            distribucionSemanal: '',
                        };

                        selectedModulesData = selectedModulesData.filter(data => data.moduloId !== selectedOptionId);
                        selectedModulesData.push(moduleData);

                        moduloId = selectedOptionId;
                        updateTotalHours();
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
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${TokenDocente}`,
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }

    async function cargarAulas(moduloId, aulaSelectElement) {
        try {
            const response = await fetch(`http://majadahorarios.test/api/v1/modulos/${moduloId}/aulas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            const data = await response.json();

            aulaSelectElement.innerHTML = '';

            if (data.aulas && data.aulas.length > 0) {
                data.aulas.forEach(aula => {
                    const optionElement = document.createElement('option');
                    optionElement.value = aula.id;
                    optionElement.textContent = aula.nombre;

                    aulaSelectElement.appendChild(optionElement);
                });
            } else {
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

    function resetTotalHours() {
        const totalHoursCell = document.getElementById('totalHorasCell');
        const guardarButton = document.getElementById('guardarButton');

        totalHoursCell.innerText = 0;
        totalHoursCell.style.backgroundColor = '';
        totalHoursCell.style.color = '';
        guardarButton.disabled = true;
    }

    function subtractModuleHours(moduleHours) {
        const totalHoursCell = document.getElementById('totalHorasCell');
        const guardarButton = document.getElementById('guardarButton');

        const currentTotalHours = parseInt(totalHoursCell.innerText) || 0;
        const newTotalHours = Math.max(0, currentTotalHours - moduleHours);

        totalHoursCell.innerText = newTotalHours;

        if (newTotalHours >= 17 && newTotalHours <= 20) {
            totalHoursCell.style.backgroundColor = 'green';
            totalHoursCell.style.color = 'white';
            guardarButton.disabled = false;
        } else {
            totalHoursCell.style.backgroundColor = 'red';
            totalHoursCell.style.color = 'white';
            guardarButton.disabled = true;
        }
    }
    async function actualizarModulo(moduloId, userId, observaciones, distribucionHoras) {
        const url = `http://majadahorarios.test/api/v1/modulos/${moduloId}`;
        const tokenDocente = sessionStorage.getItem('token');
    
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Authorization", `Bearer ${tokenDocente}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
    
        const body = new URLSearchParams();
        body.append("user_id", userId);
        body.append("observaciones", observaciones);
        body.append("distribucion_horas", distribucionHoras);
        
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: body
            });
    
            if (!response.ok) {
                throw new Error(`Error al actualizar el módulo: ${response.statusText}`);
            }
    
            return response.json();
        } catch (error) {
            console.error('Error en la actualización del módulo:', error);
            throw error; // Propaga el error para manejarlo más adelante
        }
    }
    
    document.getElementById('guardarButton').addEventListener('click', async function () {
        const filas = document.querySelectorAll('table tbody tr');
        let todoCorrecto = true;
    
        for (let fila of filas) {
            const selectModulo = fila.querySelector('select[name="teacherModules"]');
            const selectDistribucion = fila.querySelector('select[name="distribucionSemanal"]');
            const observaciones = document.getElementById('teacherObservations').value.trim();
        
            if (selectModulo && selectModulo.value !== 'selectModule') {
                const moduloId = selectModulo.value;
                const distribucionHoras = selectDistribucion ? selectDistribucion.value : '';
                const userId = userData.id;
    
                console.log("Datos a enviar:", { moduloId, userId, observaciones, distribucionHoras });
    
                try {
                    const resultado = await actualizarModulo(moduloId, userId, observaciones, distribucionHoras);
                    console.log('Resultado de la actualización:', resultado);
                } catch (error) {
                    console.error('Error al actualizar el módulo:', error);
                    todoCorrecto = false;
                    break; // Detiene el bucle si hay un error
                }
            }
        }
        
        if (todoCorrecto) {
            alert('Todos los módulos han sido actualizados correctamente.');
        } else {
            alert('Hubo un error al actualizar algunos módulos.');
        }
    });
    
    await cargarOpciones();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
