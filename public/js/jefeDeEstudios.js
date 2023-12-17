let TokenDocente = sessionStorage.getItem("token");
if (!TokenDocente) {
    window.location.href = "../../index.html"; // Redirige al index si no hay un token
}
document.addEventListener("DOMContentLoaded", async function () {
  

    async function loadDepartamentos() {
        try {
            const response = await fetch(
                `https://majadahorarios-app.onrender.com/api/v1/departamentos`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("No se pudo obtener la lista de departamentos");
            }

            const departamentosData = await response.json();
            console.log(departamentosData);

            const contenedorDepartamentos = document.getElementById(
                "contenedorDepartamentos"
            );

            departamentosData.forEach((departamento) => {
                const cardDepartamento = document.createElement("div");
                cardDepartamento.classList.add("col-md-4", "departamento-card");
                cardDepartamento.setAttribute(
                    "data-id-departamento",
                    departamento.id
                );

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
            console.error("Error al obtener la lista de departamentos:", error);
            // Manejo de errores
        }
    }

    async function loadProfesoresDepartamento(idDepartamento) {
        try {
            window.location.href = `/departamentos/${idDepartamento}/profesores`; // Ruta completa
        } catch (error) {
            console.error(
                "Error al redireccionar a la página de profesores del departamento:",
                error
            );
            // Manejo de errores
        }
    }

    async function handleDepartamentoClick(event) {
        const departamentoCard = event.target.closest(".departamento-card");
        if (departamentoCard) {
            const idDepartamento = departamentoCard.getAttribute(
                "data-id-departamento"
            );
            await loadProfesoresDepartamento(idDepartamento);
        }
    }

    // Cargar los departamentos al cargar la página
    loadDepartamentos();

    // Agregar un listener para capturar el clic en un departamento
    const contenedorDepartamentos = document.getElementById(
        "contenedorDepartamentos"
    );
    contenedorDepartamentos.addEventListener("click", handleDepartamentoClick);
});

document.getElementById("logoutButton").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "index.html";
});
document
    .getElementById("generarTablaAulas")
    .addEventListener("click", async function () {
        try {
            const response = await fetch(
                "https://majadahorarios-app.onrender.com/api/v1/obtener-datos-aulas",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Error al obtener los datos de las aulas");
            }

            const datosAulas = await response.json();

            mostrarTablaAulas(datosAulas);
        } catch (error) {
            console.error("Error:", error);
        }
    });

    function mostrarTablaAulas(datos) {
        const container = document.getElementById("tablaAulasContainer");
        container.innerHTML = ""; // Limpiar contenedor
    
          // Crear leyenda
          const leyenda = document.createElement("div");
          leyenda.innerHTML = "<p><strong>** Se pueden ordenar los datos pulsando en el nombre de la columna. **</strong></p>" +
                              "<p><strong>** Si algún aula tiene más de 30 horas, se mostrará en rojo. **</strong></p>";
          leyenda.className = "leyenda-aulas"; // Puedes asignar una clase para estilos
    
        // Crear tabla
        const tabla = document.createElement("table");
        tabla.id = "tablaAulas"; // Asegúrate de dar un ID a la tabla
        tabla.className = "table table-bordered";
    
        // Añadir cabecera
        const thead = tabla.createTHead();
        const rowHead = thead.insertRow();
        const headers = ["Aula", "Horas Semanales", "Curso", "Turno"];
        headers.forEach((header, index) => {
            let th = document.createElement("th");
            let text = document.createTextNode(header);
            th.appendChild(text);
            let span = document.createElement("span"); // Elemento para el indicador
            span.className = "orden-indicador";
            th.appendChild(span);
    
            // Añadir Event Listener a cada encabezado
            th.addEventListener("click", function() {
                ordenarTablaPorColumna(tabla.id, index, true); // true indica que se alterna el orden
            });
            rowHead.appendChild(th);
        });
    
        // Añadir datos
        const tbody = document.createElement("tbody");
        datos.forEach((item) => {
            let row = tbody.insertRow();
            row.className = parseInt(item.horas_semanales) <= 30 ? "table-success" : "table-danger";
    
            Object.values(item).forEach((text) => {
                let cell = row.insertCell();
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);
            });
        });
    
        tabla.appendChild(tbody);
    
        // Añadir leyenda y tabla al contenedor
        container.appendChild(tabla);
        container.appendChild(leyenda);
      
    }
    
function ordenarTablaPorColumna(idTabla, n, alternar) {
    let tabla, filas, cambiando, i, x, y, xValue, yValue, debeCambiar;
    let ordenDescendente = false;
    tabla = document.getElementById(idTabla);
    let encabezadoActual = tabla.rows[0].getElementsByTagName("TH")[n];
    let indicador = encabezadoActual.getElementsByClassName("orden-indicador")[0];

    // Alternar la dirección de ordenamiento si es necesario
    if (alternar) {
        ordenDescendente = indicador.classList.contains("ascendente");
        // Actualizar todos los indicadores
        Array.from(tabla.rows[0].getElementsByTagName("TH")).forEach(th => {
            th.getElementsByClassName("orden-indicador")[0].className = "orden-indicador";
        });
        indicador.className = ordenDescendente ? "orden-indicador descendente" : "orden-indicador ascendente";
    }

    cambiando = true;
    while (cambiando) {
        cambiando = false;
        filas = tabla.rows;
        for (i = 1; i < (filas.length - 1); i++) {
            debeCambiar = false;
            x = filas[i].getElementsByTagName("TD")[n];
            y = filas[i + 1].getElementsByTagName("TD")[n];

            // Verificar si la columna es numérica o de texto
            xValue = isNaN(x.innerHTML) ? x.innerHTML.toLowerCase() : parseFloat(x.innerHTML);
            yValue = isNaN(y.innerHTML) ? y.innerHTML.toLowerCase() : parseFloat(y.innerHTML);

            // Modificar la comparación para soportar orden descendente
            let comparacion = ordenDescendente ? xValue < yValue : xValue > yValue;
            if (comparacion) {
                debeCambiar = true;
                break;
            }
        }
        if (debeCambiar) {
            filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
            cambiando = true;
        }
    }
}
