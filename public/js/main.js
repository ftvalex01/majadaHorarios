let professorLogInForm = document.querySelector("#professorsForm");
let professorNameInput = document.querySelector("#professorName");
let professorDNIInput = document.querySelector("#profesorDNI");
let professorPasswordInput;
let professorConfPassInput;

professorNameInput.addEventListener("input", checkInput);
professorDNIInput.addEventListener("input", checkInput);

professorLogInForm.addEventListener("submit", (event) => {
    let validInputContorler = 0;
    professorNameInput = document.querySelector("#professorName");
    professorDNIInput = document.querySelector("#profesorDNI");
    professorPasswordInput = document.querySelector("#professorPassword");
    professorConfPassInput = document.querySelector(
        "#professorConfirmPassword"
    );

    if (!professorNameInput || professorNameInput.value.match(/^[\s]*$|\s$/)) {
        if (professorNameInput != null) {
            createErrorNameText();
        }
    } else {
        deleteErrorNameText();
        validInputContorler++;
    }

    if (
        !professorDNIInput ||
        !professorDNIInput.value.match(/^[0-9]{8}[A-Z]$/i)
    ) {
        if (professorDNIInput != null) {
            createErrorDNIText();
        }
    } else {
        deleteErrorDNIText();
        validInputContorler++;
    }

    if (
        !professorPasswordInput ||
        !professorPasswordInput.value.match(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{10,}$/
        )
    ) {
        if (professorPasswordInput != null) {
            createErrorPasswordText();
        }
    } else {
        deleteErrorPasswordText();
        validInputContorler++;
    }

    if (
        !professorConfPassInput ||
        professorConfPassInput.value != professorPasswordInput.value
    ) {
        if (professorConfPassInput != null) {
            createErrorConfirmPasswordText();
        }
    } else {
        deleteErrorConfirmPasswordText();
        validInputContorler++;
    }

    if (validInputContorler == 2) {
        updateForm();
    }

    if (validInputContorler != 4) {
        event.preventDefault();
    }
});

function checkInput(event) {
    switch (event.target.getAttribute("id")) {
        case "professorName":
            if (!event.target.value.match(/(^[\s]*$)|\s$/)) {
                validateInput(event.target);
                deleteErrorNameText();
            } else {
                invalidateInput(event.target);
            }

            break;

        case "profesorDNI":
            if (event.target.value.match(/^[0-9]{8}[A-Z]$/i)) {
                validateInput(event.target);
                deleteErrorDNIText();
            } else {
                invalidateInput(event.target);
            }

            break;

        case "professorPassword":
            if (
                event.target.value.match(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{10,}$/
                )
            ) {
                validateInput(event.target);
                deleteErrorPasswordText();
            } else {
                invalidateInput(event.target);
            }

            break;

        case "professorConfirmPassword":
            if (event.target.value == professorPasswordInput.value) {
                validateInput(event.target);
                deleteErrorConfirmPasswordText();
            } else {
                invalidateInput(event.target);
            }

            break;

        default:
            window.alert("Error inesperado");
            break;
    }
}

function createErrorNameText() {
    let nameMissInputParraf = document.createElement("p");
    nameMissInputParraf.setAttribute("id", "missInputName");
    nameMissInputParraf.classList.add("missInputText");
    nameMissInputParraf.textContent =
        "Asegúrese de Introducir un nombre de Usuario válido, sin espacios al principio o al final.";

    if (!professorLogInForm.querySelector("#missInputName")) {
        professorNameInput.insertAdjacentElement(
            "afterend",
            nameMissInputParraf
        );
    }
}

function deleteErrorNameText() {
    if (
        professorLogInForm.querySelector("#missInputName") &&
        professorNameInput.classList[0] == "validInput"
    ) {
        professorLogInForm.querySelector("#missInputName").remove();
    }
}

function createErrorDNIText() {
    let dniMissInputParraf = document.createElement("p");
    dniMissInputParraf.setAttribute("id", "missInputDNI");
    dniMissInputParraf.classList.add("missInputText");
    dniMissInputParraf.textContent =
        "Asegúrese de Introducir un DNI de Usuario válido, 8 dígitos y una letra.";

    if (!professorLogInForm.querySelector("#missInputDNI")) {
        professorDNIInput.insertAdjacentElement("afterend", dniMissInputParraf);
    }
}

function deleteErrorDNIText() {
    if (
        professorLogInForm.querySelector("#missInputDNI") &&
        professorDNIInput.classList[0] == "validInput"
    ) {
        professorLogInForm.querySelector("#missInputDNI").remove();
    }
}

function createErrorPasswordText() {
    let passwordMissInputParraf = document.createElement("p");
    passwordMissInputParraf.setAttribute("id", "missInputPassword");
    passwordMissInputParraf.classList.add("missInputText");
    passwordMissInputParraf.textContent =
        "La contraseña debe tener 10 caracteres: al menos una letra mayúscula, una minúscula y un número";

    if (!professorLogInForm.querySelector("#missInputPassword")) {
        professorPasswordInput.insertAdjacentElement(
            "afterend",
            passwordMissInputParraf
        );
    }
}

function deleteErrorPasswordText() {
    if (
        professorLogInForm.querySelector("#missInputPassword") &&
        professorPasswordInput.classList[0] == "validInput"
    ) {
        professorLogInForm.querySelector("#missInputPassword").remove();
    }
}

function createErrorConfirmPasswordText() {
    let confirmPasswordMissInputParraf = document.createElement("p");
    confirmPasswordMissInputParraf.setAttribute(
        "id",
        "missInputConfirmPassword"
    );
    confirmPasswordMissInputParraf.classList.add("missInputText");
    confirmPasswordMissInputParraf.textContent =
        "La contraseña de este campo debe ser igual a la otra contraseña.";

    if (!professorLogInForm.querySelector("#missInputConfirmPassword")) {
        professorConfPassInput.insertAdjacentElement(
            "afterend",
            confirmPasswordMissInputParraf
        );
    }
}

function deleteErrorConfirmPasswordText() {
    if (
        professorLogInForm.querySelector("#missInputConfirmPassword") &&
        professorConfPassInput.classList[0] == "validInput"
    ) {
        professorLogInForm.querySelector("#missInputConfirmPassword").remove();
    }
}

function updateForm() {
    if (!professorLogInForm.querySelector("#professorPassword")) {
        professorPasswordInput = document.createElement("input");
        professorPasswordInput.setAttribute("type", "password");
        professorPasswordInput.setAttribute("name", "professorPassword");
        professorPasswordInput.setAttribute("id", "professorPassword");
        professorPasswordInput.setAttribute("placeholder", "Contraseña");
        professorLogInForm
            .querySelector("div#submitBox")
            .insertAdjacentElement("beforebegin", professorPasswordInput);

        professorPasswordInput =
            professorLogInForm.querySelector("#professorPassword");
        professorPasswordInput.addEventListener("input", checkInput);
    }

    if (!professorLogInForm.querySelector("#professorConfirmPassword")) {
        professorConfPassInput = document.createElement("input");
        professorConfPassInput.setAttribute("type", "password");
        professorConfPassInput.setAttribute("name", "professorConfirmPassword");
        professorConfPassInput.setAttribute("id", "professorConfirmPassword");
        professorConfPassInput.setAttribute(
            "placeholder",
            "Repetir Contraseña"
        );
        professorLogInForm
            .querySelector("div#submitBox")
            .insertAdjacentElement("beforebegin", professorConfPassInput);

        professorConfPassInput = professorLogInForm.querySelector(
            "#professorConfirmPassword"
        );
        professorConfPassInput.addEventListener("input", checkInput);
    }

    professorLogInForm
        .querySelector("#submitButton")
        .setAttribute("value", "Acceder");
}

function validateInput(element) {
    if (element.classList.length > 0) {
        element.classList.replace(element.classList[0], "validInput");
    } else {
        element.classList.add("validInput");
    }
}

function invalidateInput(element) {
    if (element.classList.length > 0) {
        element.classList.replace(element.classList[0], "invalidInput");
    } else {
        element.classList.add("invalidInput");
    }
}
