document.addEventListener('DOMContentLoaded', function () {
    // Obtén la información del usuario almacenada en la respuesta JSON
    const userData = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    const TokenDocente = sessionStorage.getItem('token');
    // Muestra el nombre del usuario en el elemento con id "userName"
    document.getElementById('userName').innerText = userData.name || '';
    document.getElementById('teacher').innerText = 'Docente: ' + userData.name || '';
    // Muestra la especialidad del usuario en el elemento con id "specialization"
    document.getElementById('specialization').innerText = 'Especialización: ' + (userData.especialidad.nombre || '');
    // Muestra el departamento del usuario en el elemento con id "department"
    document.getElementById('department').innerText = 'Departamento: ' + (userData.departamento.nombre || '');
    // Agrega un evento de clic al botón de logout
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Elimina el token y redirige al usuario al formulario de login
        sessionStorage.clear();
        window.location.href = 'index.html'; // Cambia la URL según tu estructura de rutas
    });

    const selectElements = document.getElementsByName('teacherModules');

    // Función para cargar las opciones de los select desde la base de datos
    async function cargarOpciones() {
        try {
            const response = await fetch('http://majadahorarios.test/api/v1/modulos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            const data = await response.json();
            console.log(data);

            selectElements.forEach(selectElement => {
                // ... Tu código existente para llenar los options del select
                selectElement.innerHTML = '';

                // Agrega una opción por defecto (placeholder)
                const optionPlaceholder = document.createElement('option');
                optionPlaceholder.value = 'selectModule';
                optionPlaceholder.textContent = 'Selecciona Modulo';

                selectElement.appendChild(optionPlaceholder);

                // Agrega las opciones de la base de datos al select
                data.data.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.id;  // Cambio aquí
                    optionElement.textContent = option.materia;
                    selectElement.appendChild(optionElement);
                });
            });

            selectElements.forEach(selectElement => {
                selectElement.addEventListener('change', async function (event) {
                    const selectedOptionId = event.target.value;  // Cambio aquí
            
                    try {
                        const specificModuleData = await SelectSpecificModule(selectedOptionId);
                        const row = event.target.closest('tr');

                        row.cells[0].innerText = specificModuleData.data.turno;
                        row.cells[3].innerText = specificModuleData.data.h_semanales;

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

    // Llama a la función para cargar las opciones al cargar la página
    cargarOpciones();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
