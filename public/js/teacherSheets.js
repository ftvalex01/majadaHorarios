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

            selectedModules.clear();
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

    cargarOpciones();

    selectElements.forEach((selectElement, index) => {
        selectElement.addEventListener('change', async function (event) {
            const selectedOptionId = event.target.value;

            try {
                if (selectedModules.has(selectedOptionId)) {
                    console.log('Módulo ya seleccionado');
                    event.target.value = 'selectModule';

                    return;
                }

                selectedModules.delete(selectedOptionId);

                data.data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.id;
                    optionElement.textContent = option.materia;

                    if (selectedModules.has(option.id)) {
                        optionElement.disabled = true;
                    }

                    selectElement.appendChild(optionElement);
                });

                const specificModuleData = await SelectSpecificModule(selectedOptionId);
                const row = event.target.closest('tr');
                const totalHoras = specificModuleData.data.h_semanales;

                row.cells[3].innerText = totalHoras;

                const opcionesDistribucion = generarOpcionesDistribucion(totalHoras);

                const distribucionSemanalSelect = distribucionSemanalElements[index];
                distribucionSemanalSelect.innerHTML = '';

                for (const opcion of opcionesDistribucion) {
                    const opcionElement = document.createElement('option');
                    opcionElement.value = opcion.join('+');
                    opcionElement.textContent = `(${opcion.join('+')})`;
                    distribucionSemanalSelect.appendChild(opcionElement);
                }

                selectedModules.add(selectedOptionId);

                // Actualiza el campo "Curso y Ciclo"
                const cursoCicloCell = row.cells[1]; // Asumiendo que la celda correspondiente es la segunda
                cursoCicloCell.innerText = specificModuleData.data.Estudio;
            } catch (error) {
                console.error('Error al obtener datos del módulo específico:', error);
            }
        });
    });
});
