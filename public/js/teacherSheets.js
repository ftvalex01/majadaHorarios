let TokenDocente = sessionStorage.getItem("token");
if (!TokenDocente) {
    window.location.href = "../../index.html"; // Redirige al index si no hay un token
}
document.addEventListener("DOMContentLoaded", async function () {
    
    const userData = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
   
    let moduloId = null;

   
    document.getElementById("userName").innerText = userData.name || "";
    document.getElementById("teacher").innerText =
        "Docente: " + userData.name || "";
    document.getElementById("specialization").innerText =
        "Especialización: " + (userData.especialidad?.nombre || "");
    document.getElementById("department").innerText =
        "Departamento: " + (userData.departamento?.nombre || "");

   
    function updateTotalHours() {
        const totalHoursCell = document.getElementById("totalHorasCell");
        const guardarButton = document.getElementById("guardarButton");
        const totalHours = Array.from(
            document.querySelectorAll("td:nth-child(4)")
        )
            .map((td) => parseInt(td.innerText) || 0)
            .reduce((acc, curr) => acc + curr, 0);

        totalHoursCell.innerText = totalHours;

        if (totalHours >= 17 && totalHours <= 20) {
            totalHoursCell.style.backgroundColor = "green";
            totalHoursCell.style.color = "white";
            guardarButton.disabled = false;
        } else {
            totalHoursCell.style.backgroundColor = "red";
            totalHoursCell.style.color = "white";
            guardarButton.disabled = true;
        }
    }

    // Revisa el rol del usuario y actualiza el nav
    const navbarDiv = document.querySelector(
        ".collapse.navbar-collapse.justify-content-end#navbarNav"
    );
    if (
        userData.rol === "jefe_departamento" ||
        userData.rol === "jefe_estudios"
    ) {
        const links = [];
        if (userData.rol === "jefe_estudios") {
            // Agrega un enlace adicional para el jefe de estudios
            links.push({
                href: "https://majadahorarios-app.onrender.com/admin",
                text: "Registro de Profesores",
            });
            links.push({
                href: "https://majadahorarios-app.onrender.com/jefeDeEstudios",
                text: "Hoja de Jefe de Estudios",
            });
        } else if (userData.rol === "jefe_departamento") {
            links.push({
                href: "https://majadahorarios-app.onrender.com/jefeDeDepartamento",
                text: "Hoja de departamento",
            });
        }

        links.forEach((link) => {
            const newNavItem = document.createElement("li");
            newNavItem.classList.add("nav-item");
            const newLink = document.createElement("a");
            newLink.classList.add("nav-link");
            newLink.href = link.href;
            newLink.textContent = link.text;
            newNavItem.appendChild(newLink);
            navbarDiv
                .querySelector(".navbar-nav")
                .insertBefore(
                    newNavItem,
                    navbarDiv.querySelector("#logoutButton").parentNode
                );
        });
    }


    document
        .getElementById("logoutButton")
        .addEventListener("click", function () {
            sessionStorage.clear();
            window.location.href = "index.html";
        });

    
    const selectedModules = new Set(userData.selectedModules || []);
    const selectElements = document.getElementsByName("teacherModules");
    let selectedModulesData = [];

    // Function cargar opciones
    async function cargarOpciones() {
        try {
            const especialidadId = userData.especialidad?.id;
            if (!especialidadId) {
                console.error("No se encontró la especialidad del usuario");
                return;
            }

            const url = `https://majadahorarios-app.onrender.com/api/v1/especialidades/${especialidadId}/modulos`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TokenDocente}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Error al obtener datos: ${response.statusText}`
                );
            }

            const data = await response.json();

  
            selectElements.forEach((selectElement, index) => {
                selectElement.innerHTML = "";

                const optionPlaceholder = document.createElement("option");
                optionPlaceholder.value = "selectModule";
                optionPlaceholder.textContent = "Selecciona Modulo";

                selectElement.appendChild(optionPlaceholder);

                data.data.forEach((option) => {
                    // Solo añadir la opción si el módulo no tiene un user_id asignado o si el user_id es el del usuario actual
                    if (
                        option.user_id === null ||
                        option.user_id === userData.id
                    ) {
                        const optionElement = document.createElement("option");
                        optionElement.value = option.id;
                        optionElement.textContent = option.materia;

                        if (selectedModules.has(option.id)) {
                            optionElement.disabled = true;
                        }

                        selectElement.appendChild(optionElement);
                    }
                });
            });


            selectElements.forEach((selectElement) => {
                selectElement.addEventListener(
                    "change",
                    async function (event) {
                        const selectedOptionId = event.target.value;

        
                        if (selectedOptionId === "selectModule") {
                            const row = event.target.closest("tr");
                            const moduleHours =
                                parseInt(row.cells[3].innerText) || 0;
                            subtractModuleHours(moduleHours);

                            row.cells[0].innerText = "";
                            row.cells[1].innerText = "";
                            row.cells[3].innerText = "";

                            const distribucionSemanalSelect =
                                row.cells[4].querySelector("select");
                            distribucionSemanalSelect.innerHTML = "";

                            const aulaSelectElement =
                                row.cells[5].querySelector("select");
                            aulaSelectElement.innerHTML = "";

                            selectElements.forEach((otherSelectElement) => {
                                if (otherSelectElement !== selectElement) {
                                    Array.from(
                                        otherSelectElement.options
                                    ).forEach((option) => {
                                        option.disabled = false;
                                    });
                                }
                            });

            
                            selectedModulesData = selectedModulesData.filter(
                                (data) => data.moduloId !== selectedOptionId
                            );

                            updateTotalHours();
                            actualizarOpcionesDisponibles();
                            return;
                        }
                        actualizarOpcionesDisponibles();
                        try {
                            const specificModuleData =
                                await SelectSpecificModule(selectedOptionId);
                            const row = event.target.closest("tr");
                            const totalHoras =
                                specificModuleData.data.h_semanales;

                            row.cells[0].innerText = capitalizeFirstLetter(
                                specificModuleData.data.curso.turno
                            );
                            row.cells[1].innerText = `Curso: ${specificModuleData.data.curso.nombre} - Ciclo: ${specificModuleData.data.curso.año}`;
                            row.cells[3].innerText = totalHoras;

                            const distribucionSemanalSelect =
                                row.cells[4].querySelector("select");
                            distribucionSemanalSelect.innerHTML = "";

                            const opcionesDistribucion =
                                generarOpcionesDistribucion(totalHoras);

                            for (const opcion of opcionesDistribucion) {
                                const opcionElement =
                                    document.createElement("option");
                                opcionElement.value = opcion.join("+");
                                opcionElement.textContent = `(${opcion.join(
                                    "+"
                                )})`;
                                distribucionSemanalSelect.appendChild(
                                    opcionElement
                                );
                            }

                            const aulaSelectElement =
                                row.cells[5].querySelector("select");
                            await cargarAulas(
                                selectedOptionId,
                                aulaSelectElement
                            );

                          
                            selectElements.forEach((otherSelectElement) => {
                                if (otherSelectElement !== selectElement) {
                                    Array.from(
                                        otherSelectElement.options
                                    ).forEach((option) => {
                                        if (option.value === selectedOptionId) {
                                            option.disabled = true;
                                        }
                                    });
                                }
                            });

                           
                            const moduleData = {
                                moduloId: selectedOptionId,
                                distribucionSemanal: "",
                            };

                            selectedModulesData = selectedModulesData.filter(
                                (data) => data.moduloId !== selectedOptionId
                            );
                            selectedModulesData.push(moduleData);

                            moduloId = selectedOptionId;
                            updateTotalHours();
                        } catch (error) {
                            console.error(
                                "Error al obtener datos del módulo específico:",
                                error
                            );
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }
    function actualizarOpcionesDisponibles() {
        // Obtener todos los módulos seleccionados en todos los select, excepto el actual
        const modulosSeleccionados = new Set();
        selectElements.forEach((selectElement) => {
            const valorSeleccionado = selectElement.value;
            if (valorSeleccionado !== "selectModule") {
                modulosSeleccionados.add(valorSeleccionado);
            }
        });

        // Actualizar las opciones de cada select individualmente
        selectElements.forEach((selectElement) => {
            const valorActual = selectElement.value;
            Array.from(selectElement.options).forEach((option) => {
                if (option.value !== "selectModule") {
                    // Si el valor de la opción está en modulosSeleccionados y no es el valor actual del select, deshabilitar
                    option.disabled =
                        modulosSeleccionados.has(option.value) &&
                        option.value !== valorActual;
                }
            });
        });
    }


    async function SelectSpecificModule(selectModule) {
        return await fetch(
            `https://majadahorarios-app.onrender.com/api/v1/modulos/${selectModule}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${TokenDocente}`,
                    Accept: "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error("Error al obtener datos:", error);
            });
    }

  
    async function cargarAulas(moduloId, aulaSelectElement) {
        try {
            const response = await fetch(
                `https://majadahorarios-app.onrender.com/api/v1/modulos/${moduloId}/aulas`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TokenDocente}`,
                    },
                }
            );

            const data = await response.json();

            aulaSelectElement.innerHTML = "";

            if (data.aulas && data.aulas.length > 0) {
                data.aulas.forEach((aula) => {
                    const optionElement = document.createElement("option");
                    optionElement.value = aula.id;
                    optionElement.textContent = aula.nombre;

                    aulaSelectElement.appendChild(optionElement);
                });
            } else {
                const optionElement = document.createElement("option");
                optionElement.textContent = "No hay aulas disponibles";
                aulaSelectElement.appendChild(optionElement);
            }
        } catch (error) {
            console.error("Error al obtener datos de las aulas:", error);
        }
    }


    function generarOpcionesDistribucion(totalHoras) {
        const opciones = [];
        generarOpciones([], totalHoras, 3, opciones);
        return opciones;
    }

    function generarOpciones(
        combActual,
        horasRestantes,
        diasRestantes,
        opciones
    ) {
        if (horasRestantes === 0 && diasRestantes >= 0) {
            opciones.push([...combActual]);
            return;
        }

        for (let i = 1; i <= 3; i++) {
            if (i <= horasRestantes) {
                combActual.push(i);
                if (diasRestantes > 0) {
                    generarOpciones(
                        combActual,
                        horasRestantes - i,
                        diasRestantes - 1,
                        opciones
                    );
                }
                combActual.pop();
            }
        }
    }

 
    function resetTotalHours() {
        const totalHoursCell = document.getElementById("totalHorasCell");
        const guardarButton = document.getElementById("guardarButton");

        totalHoursCell.innerText = 0;
        totalHoursCell.style.backgroundColor = "";
        totalHoursCell.style.color = "";
        guardarButton.disabled = true;
    }


    function subtractModuleHours(moduleHours) {
        const totalHoursCell = document.getElementById("totalHorasCell");
        const guardarButton = document.getElementById("guardarButton");

        const currentTotalHours = parseInt(totalHoursCell.innerText) || 0;
        const newTotalHours = Math.max(0, currentTotalHours - moduleHours);

        totalHoursCell.innerText = newTotalHours;

        if (newTotalHours >= 17 && newTotalHours <= 20) {
            totalHoursCell.style.backgroundColor = "green";
            totalHoursCell.style.color = "white";
            guardarButton.disabled = false;
        } else {
            totalHoursCell.style.backgroundColor = "red";
            totalHoursCell.style.color = "white";
            guardarButton.disabled = true;
        }
    }
    async function actualizarModulo(
        moduloId,
        userId,
        observaciones,
        distribucionHoras
    ) {
        const url = `https://majadahorarios-app.onrender.com/api/v1/modulos/${moduloId}`;
        const tokenDocente = sessionStorage.getItem("token");

        const data = {
            user_id: userId,
            observaciones: observaciones,
            distribucion_horas: distribucionHoras,
        };

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenDocente}`,
                },
                body: JSON.stringify(data),
            });

            return await response.json();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al actualizar algunos módulos.",
                icon: "error",
                confirmButtonText: "Ok",
            });
            throw error;
        }
    }
    document
        .getElementById("guardarButton")
        .addEventListener("click", async function () {
            const filas = document.querySelectorAll("table tbody tr");
            let todoCorrecto = true;
            const totalHoursCell = document.getElementById("totalHorasCell");
            const totalHours = parseInt(totalHoursCell.innerText) || 0;

            // Verificar si las horas están en el rango correcto
            if (totalHours < 17 || totalHours > 20) {
                Swal.fire({
                    title: "Error",
                    text: "No puedes enviar el formulario si no tienes las horas en verde",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                return;
            }

            for (let fila of filas) {
                const selectModulo = fila.querySelector(
                    'select[name="teacherModules"]'
                );
                const selectDistribucion = fila.querySelector(
                    'select[name="distribucionSemanal"]'
                );
                const observaciones = document
                    .getElementById("teacherObservations")
                    .value.trim();

                if (selectModulo && selectModulo.value !== "selectModule") {
                    const moduloId = selectModulo.value;
                    let distribucionHoras = selectDistribucion
                        ? selectDistribucion.value
                        : "";
                    distribucionHoras = `(${distribucionHoras})`;
                    const userId = userData.id;

                    try {
                        const resultado = await actualizarModulo(
                            moduloId,
                            userId,
                            observaciones,
                            distribucionHoras
                        );
                        // Puedes procesar el resultado si es necesario
                    } catch (error) {
                        console.error("Error al actualizar el módulo:", error);
                        todoCorrecto = false;
                        break;
                    }
                }
            }

            if (todoCorrecto) {
                Swal.fire({
                    title: "Éxito",
                    text: "Todos los módulos han sido actualizados correctamente.",
                    icon: "success",
                    confirmButtonText: "Ok",
                }).then(() => {
                    // Descargar PDF
                    descargarPDF();
                    limpiarTabla();
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al actualizar algunos módulos.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        });
    function limpiarTabla() {
        const filas = document.querySelectorAll("table tbody tr");

        filas.forEach((fila) => {
            // Limpiar los 'select' de Módulos, Distribución Semanal y Aulas
            const selectModulos = fila.querySelector(
                'select[name="teacherModules"]'
            );
            const selectDistribucion = fila.querySelector(
                'select[name="distribucionSemanal"]'
            );
            const selectAulas = fila.querySelector(
                'select[name="teacherAulas"]'
            );

            if (selectModulos) selectModulos.selectedIndex = 0;
            if (selectDistribucion) selectDistribucion.innerHTML = "";
            if (selectAulas) selectAulas.innerHTML = "";

            // Limpiar las celdas de texto
            const turnoCell = fila.querySelector(".turno");
            const cursoCicloCell = fila.querySelector("#cursoCicloCell"); // Asegúrate de que el ID es único
            const horasModuloCell = fila.querySelector(".horas-modulo");

            if (turnoCell) turnoCell.innerText = "";
            if (cursoCicloCell) cursoCicloCell.innerText = "";
            if (horasModuloCell) horasModuloCell.innerText = "";
        });

        // Restablecer el total de horas
        const totalHoursCell = document.getElementById("totalHorasCell");
        totalHoursCell.innerText = "0";
        totalHoursCell.style.backgroundColor = "";
        totalHoursCell.style.color = "";
    }

    
    await cargarOpciones();
    function getCurrentSchoolYear() {
        const today = new Date();
        const currentMonth = today.getMonth(); 
        const currentYear = today.getFullYear();

       
        let startYear, endYear;
        if (currentMonth >= 8) {
        
            startYear = currentYear;
            endYear = currentYear + 1;
        } else {
            
            startYear = currentYear - 1;
            endYear = currentYear;
        }

      
        return `${startYear}/${endYear}`;
    }
  
    const currentSchoolYear = getCurrentSchoolYear();

   
    document.getElementById(
        "schoolYear"
    ).innerText = `Curso: ${currentSchoolYear}`;
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function descargarPDF() {
    const userData = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Hoja de Profesor: ${userData.name || ""}`, 14, 15);

    console.log(obtenerDatosTabla());
    const datosTabla = obtenerDatosTabla();

    // Verificar si hay datos para mostrar
    if (datosTabla.length > 0) {
        doc.autoTable({
            head: [
                [
                    "Turno (M/T)",
                    "Curso y Ciclo",
                    "Módulo",
                    "Horas",
                    "Distribución Semanal",
                    "Aula/Taller",
                ],
            ],
            body: datosTabla,
            startY: 20,
        });
    } else {
        doc.text("No hay datos para mostrar.", 14, 30);
    }
    // Extraer y agregar texto de observaciones
    const textoObservaciones = document
        .getElementById("teacherObservations")
        .value.trim();
    const yFinalTabla = doc.lastAutoTable.finalY || 50; // Posición Y después de la tabla
    doc.text("Observaciones:", 14, yFinalTabla + 10); // Título de la sección de observaciones
    doc.text(textoObservaciones, 14, yFinalTabla + 15, {
        maxWidth: 180,
    }); // Texto de las observaciones
    doc.save("tabla-enviada.pdf");
}
function obtenerDatosTabla() {
    const filas = document.querySelectorAll("#teacherTable tbody tr");
    let datosTabla = [];

    filas.forEach((fila) => {
        let datosFila = [];
        let esFilaValida = true;

        fila.querySelectorAll("td").forEach((celda, index) => {
            const select = celda.querySelector("select");
            if (select) {
                const opcionSeleccionada =
                    select.selectedIndex >= 0
                        ? select.options[select.selectedIndex].text
                        : "No seleccionado";
                if (
                    opcionSeleccionada !== "Selecciona Modulo" &&
                    opcionSeleccionada !== "No seleccionado"
                ) {
                    datosFila.push(opcionSeleccionada);
                } else {
                    esFilaValida = false;
                }
            } else {
                datosFila.push(celda.textContent.trim());
            }
        });

        if (esFilaValida) {
            datosTabla.push(datosFila);
        }
    });

    return datosTabla;
}
