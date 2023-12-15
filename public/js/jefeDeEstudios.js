let TokenDocente = sessionStorage.getItem('token');
if (!TokenDocente) {
    window.location.href = '../../index.html'; // Redirige al index si no hay un token
}
document.addEventListener('DOMContentLoaded', async function () {
    // const TokenDocente = sessionStorage.getItem('token');

    async function loadDepartamentos() {
        try {
            const response = await fetch(`http://majadahorarios.test/api/v1/departamentos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TokenDocente}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de departamentos');
            }

            const departamentosData = await response.json();
            console.log(departamentosData);

            const contenedorDepartamentos = document.getElementById('contenedorDepartamentos');

            departamentosData.forEach(departamento => {
                const cardDepartamento = document.createElement('div');
                cardDepartamento.classList.add('col-md-4', 'departamento-card');
                cardDepartamento.setAttribute('data-id-departamento', departamento.id);

                cardDepartamento.innerHTML = `
                <div class="card mb-4 box-shadow">
                    <div class="card-body d-flex justify-content-center align-items-center">
                        <button class="btn btn-primary departamento-btn" data-id-departamento="${departamento.id}">
                            ${departamento.nombre}
                        </button>
                    </div>
                </div>
            `;
            

                contenedorDepartamentos.appendChild(cardDepartamento);
            });
        } catch (error) {
            console.error('Error al obtener la lista de departamentos:', error);
            // Manejo de errores
        }
    }

    async function loadProfesoresDepartamento(idDepartamento) {
        try {
            window.location.href = `/departamentos/${idDepartamento}/profesores`; // Ruta completa
        } catch (error) {
            console.error('Error al redireccionar a la página de profesores del departamento:', error);
            // Manejo de errores
        }
    }


    async function handleDepartamentoClick(event) {
        const departamentoCard = event.target.closest('.departamento-card');
        if (departamentoCard) {
            const idDepartamento = departamentoCard.getAttribute('data-id-departamento');
            await loadProfesoresDepartamento(idDepartamento);
        }
    }

    // Cargar los departamentos al cargar la página
    loadDepartamentos();

    // Agregar un listener para capturar el clic en un departamento
    const contenedorDepartamentos = document.getElementById('contenedorDepartamentos');
    contenedorDepartamentos.addEventListener('click', handleDepartamentoClick);
});

document.getElementById('logoutButton').addEventListener('click', function () {
    sessionStorage.clear();
    window.location.href = 'index.html';
});
document.getElementById('generarTablaAulas').addEventListener('click', async function() {
    try {
        const response = await fetch('http://majadahorarios.test/api/v1/obtener-datos-aulas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TokenDocente}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de las aulas');
        }

        const datosAulas = await response.json();
        mostrarTablaAulas(datosAulas);
    } catch (error) {
        console.error('Error:', error);
    }
});

function mostrarTablaAulas(datos) {
    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered';

    // Añadir cabecera
    const thead = tabla.createTHead();
    const rowHead = thead.insertRow();
    const headers = ['Aula', 'Horas Semanales', 'Curso', 'Turno'];
    headers.forEach(header => {
        let th = document.createElement('th');
        let text = document.createTextNode(header);
        th.appendChild(text);
        rowHead.appendChild(th);
    });

    // Añadir datos
    const tbody = document.createElement('tbody');
    datos.forEach(item => {
        let row = tbody.insertRow();
        row.className = parseInt(item.horas_semanales) <= 30 ? 'table-success' : 'table-danger'; // Clase verde si <= 30, rojo si no

        Object.values(item).forEach(text => {
            let cell = row.insertCell();
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
        });
    });

    tabla.appendChild(tbody);
    const container = document.getElementById('tablaAulasContainer');
    container.innerHTML = ''; // Limpiar contenedor
    container.appendChild(tabla); // Añadir tabla al contenedor
}
