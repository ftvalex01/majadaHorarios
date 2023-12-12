document.addEventListener('DOMContentLoaded', async function () {
    // Obtener el ID del departamento desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idDepartamento = urlParams.get('id');
    const TokenDocente = sessionStorage.getItem('token');
    
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

            const profesoresDepartamento = await response.json();
            console.log(profesoresDepartamento);

            // Mostrar los profesores en el HTML
            const profesoresListElement = document.getElementById('profesoresList');
            profesoresDepartamento.forEach(profesor => {
                const profesorElement = document.createElement('p');
                profesorElement.textContent = `Nombre: ${profesor.nombre}, Email: ${profesor.email}`;
                profesoresListElement.appendChild(profesorElement);
            });
        } catch (error) {
            console.error('Error al obtener profesores del departamento:', error);
            // Manejo de errores
        }
    }

    // Cargar los profesores del departamento al cargar la página
    if (idDepartamento) {
        loadProfesoresPorDepartamento(idDepartamento);
    } else {
        console.error('ID de departamento no encontrado en la URL');
    }
});