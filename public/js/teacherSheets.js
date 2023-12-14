let TokenDocente = sessionStorage.getItem('token');
if (!TokenDocente) {
    window.location.href = '../../index.html'; // Redirige al index si no hay un token
}
document.addEventListener('DOMContentLoaded', async function () {
    // Retrieve user data and token from sessionStorage
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    // const TokenDocente = sessionStorage.getItem('token');
    let moduloId = null;

    // Set user-related information on the page
    document.getElementById('userName').innerText = userData.name || '';
    document.getElementById('teacher').innerText = 'Docente: ' + userData.name || '';
    document.getElementById('specialization').innerText = 'Especialización: ' + (userData.especialidad?.nombre || '');
    document.getElementById('department').innerText = 'Departamento: ' + (userData.departamento?.nombre || '');

    // Function to update total hours and button state
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

    // Check user role and update navbar links accordingly
    const navbarDiv = document.querySelector('.collapse.navbar-collapse.justify-content-end#navbarNav');
    if (userData.rol === "jefe_departamento" || userData.rol === "jefe_estudios") {
        const links = [

        ];
        if (userData.rol === "jefe_estudios") {
            // Agrega un enlace adicional para el jefe de estudios
            links.push({
                href: 'http://majadahorarios.test/admin',
                text: 'Registro de Profesores'
            });
            links.push({
                href: 'http://majadahorarios.test/jefeDeEstudios',
                text: 'Hoja de Jefe de Estudios'
            });
        } else if (userData.rol === "jefe_departamento") {
            links.push({
                href: 'http://majadahorarios.test/jefeDeDepartamento',
                text: 'Hoja de departamento'
            });
        }

        links.forEach(link => {
            const newNavItem = document.createElement('li');
            newNavItem.classList.add('nav-item');
            const newLink = document.createElement('a');
            newLink.classList.add('nav-link');
            newLink.href = link.href;
            newLink.textContent = link.text;
            newNavItem.appendChild(newLink);
            navbarDiv.querySelector('.navbar-nav').insertBefore(newNavItem, navbarDiv.querySelector('#logoutButton').parentNode);
        });
    }

    // Logout button event listener
    document.getElementById('logoutButton').addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = 'index.html';
    });

    // Initialize selectedModules and selectElements
    const selectedModules = new Set(userData.selectedModules || []);
    const selectElements = document.getElementsByName('teacherModules');
    let selectedModulesData = [];

    // Function to load module options
    async function cargarOpciones() {
        try {

            const especialidadId = userData.especialidad?.id;
            if (!especialidadId) {
                console.error('No se encontró la especialidad del usuario');
                return;
            }
    
            const url = `http://majadahorarios.test/api/v1/especialidades/${especialidadId}/modulos`;
            const response = await fetch(url, {
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

            // Iterate through selectElements and populate them with options
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

            // Add change event listeners to selectElements
            selectElements.forEach(selectElement => {
                selectElement.addEventListener('change', async function (event) {
                    const selectedOptionId = event.target.value;

                    // Handle when "Selecciona Modulo" is selected
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

                        // Enable all other select elements
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

                        // Disable the selected option in other select elements
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

    // Fetch data for a specific module
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

    // Function to load aulas for a module
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

    // Function to generate distribution options
    function generarOpcionesDistribucion(totalHoras) {
        const opciones = [];
        generarOpciones([], totalHoras, 3, opciones);
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

    // Reset total hours and button state
    function resetTotalHours() {
        const totalHoursCell = document.getElementById('totalHorasCell');
        const guardarButton = document.getElementById('guardarButton');

        totalHoursCell.innerText = 0;
        totalHoursCell.style.backgroundColor = '';
        totalHoursCell.style.color = '';
        guardarButton.disabled = true;
    }

    // Subtract module hours and update button state
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

        const data = {
            user_id: userId,
            observaciones: observaciones,
            distribucion_horas: distribucionHoras
        };
      
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenDocente}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en la actualización del módulo:', error);
            throw error;
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
                let distribucionHoras = selectDistribucion ? selectDistribucion.value : '';
                distribucionHoras = `(${distribucionHoras})`;
                const userId = userData.id; 
                console.log(`Modulo ID: ${moduloId}, Distribución Horas: ${distribucionHoras}, User ID: ${userId}`);

                try {
                    const resultado = await actualizarModulo(moduloId, userId, observaciones, distribucionHoras);
                    console.log('Resultado de la actualización:', resultado);
                } catch (error) {
                    console.error('Error al actualizar el módulo:', error);
                    todoCorrecto = false;
                    break;
                }
            }
        }

        if (todoCorrecto) {
            alert('Todos los módulos han sido actualizados correctamente.');
        } else {
            alert('Hubo un error al actualizar algunos módulos.');
        }
    });



    // Load module options
    await cargarOpciones();
    function getCurrentSchoolYear() {
        const today = new Date();
        const currentMonth = today.getMonth(); // 0-indexed (0 for January, 11 for December)
        const currentYear = today.getFullYear();

        // Calculate the start and end years for the school year
        let startYear, endYear;
        if (currentMonth >= 8) {
            // If the current month is August or later, the school year has started
            startYear = currentYear;
            endYear = currentYear + 1;
        } else {
            // Otherwise, the school year has not started yet (current month is before August)
            startYear = currentYear - 1;
            endYear = currentYear;
        }

        // Format the school year as "YYYY/YYYY"
        return `${startYear}/${endYear}`;
    }
    // Call the function to get the current school year
    const currentSchoolYear = getCurrentSchoolYear();

    // Set the value in your HTML
    document.getElementById('schoolYear').innerText = `Curso: ${currentSchoolYear}`;
});

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


