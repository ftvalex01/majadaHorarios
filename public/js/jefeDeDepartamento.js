document.addEventListener('DOMContentLoaded', function () {
    // Realizar una solicitud a la API para obtener la información de los profesores
    fetch('/jefeDeDepartamento')
        .then(response => response.json())
        .then(data => {
            // Acceder a la información del jefe de departamento y la lista de profesores
            const jefeDeDepartamento = data.jefeDeDepartamento;
            const profesores = data.profesores;

            // Llenar la información del jefe de departamento en el HTML
            document.getElementById('jefeNombre').innerText = 'Nombre: ' + jefeDeDepartamento.name || '';
            document.getElementById('jefeEmail').innerText = 'Email: ' + jefeDeDepartamento.email || '';

            // Obtener el contenedor donde se mostrarán los profesores
            const listaProfesores = document.getElementById('listaProfesores');

            // Limpiar el contenedor antes de agregar nuevos elementos
            listaProfesores.innerHTML = '';

            // Iterar sobre la lista de profesores y actualizar dinámicamente el contenido
            profesores.forEach(profesor => {
                // Crear un nuevo elemento div para cada profesor
                const div = document.createElement('div');
                div.className = 'col';
                div.innerHTML = `
                    <div class="card h-100">
                        <img src="https://via.placeholder.com/300" class="card-img-top" alt="Professor Image">
                        <div class="card-body">
                            <h5 class="card-title">${profesor.name}</h5>
                            <p class="card-text">Especialidad: ${profesor.especialidad_id}</p>
                            <p class="card-text">Correo electrónico: ${profesor.email}</p>
                            <!-- Agregar más información según sea necesario -->
                            <a href="#" class="btn btn-primary">View Details</a>
                            <a href="#" class="btn btn-primary">View TeacherSheet</a>
                        </div>
                    </div>
                `;

                // Agregar el nuevo elemento al contenedor
                listaProfesores.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
});
