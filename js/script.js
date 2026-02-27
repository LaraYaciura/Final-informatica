// --- Capturar elementos del DOM ---
const formulario = document.querySelector('#formularioContacto');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const inputAsunto = document.querySelector('#asunto');
const inputMensaje = document.querySelector('#mensaje');

// --- Elementos para mostrar errores ---
const errorNombre = document.querySelector('#errorNombre');
const errorEmail = document.querySelector('#errorEmail');
const errorAsunto = document.querySelector('#errorAsunto');
const errorMensaje = document.querySelector('#errorMensaje');

// --- Elementos para feedback y storage ---
const mensajeExito = document.querySelector('#mensajeExito');
const ultimaConsultaDiv = document.querySelector('#ultimaConsulta');
const datosUltimaConsulta = document.querySelector('#datosUltimaConsulta');

// --- Función para validar Email ---
function esEmailValido(email) {
    if (email === '') return false;
    
    let posicionArroba = email.indexOf('@');
    let posicionPunto = email.lastIndexOf('.');
    
    if (posicionArroba < 1 || 
        posicionPunto < posicionArroba + 2 || 
        posicionPunto === email.length - 1) {
        return false;
    }
    return true;
}

// --- Función para quitar clase de error de Bootstrap ---
function quitarError(elemento) {
    elemento.classList.remove('is-invalid');
}

// --- Función para poner clase de error de Bootstrap ---
function ponerError(elemento, mensaje) {
    elemento.classList.add('is-invalid');
}

// --- Función para validar el formulario completo ---
function validarFormulario() {
    let esValido = true;
    
    // Resetear clases de error
    [inputNombre, inputEmail, inputAsunto, inputMensaje].forEach(input => {
        input.classList.remove('is-invalid');
    });
    
    // 1. Validar Nombre
    if (inputNombre.value.trim() === '') {
        errorNombre.textContent = 'El nombre es obligatorio.';
        ponerError(inputNombre);
        esValido = false;
    } else {
        errorNombre.textContent = '';
        quitarError(inputNombre);
    }
    
    // 2. Validar Email
    if (inputEmail.value.trim() === '') {
        errorEmail.textContent = 'El correo es obligatorio.';
        ponerError(inputEmail);
        esValido = false;
    } else if (!esEmailValido(inputEmail.value.trim())) {
        errorEmail.textContent = 'El formato del correo no es válido (ej: nombre@dominio.com).';
        ponerError(inputEmail);
        esValido = false;
    } else {
        errorEmail.textContent = '';
        quitarError(inputEmail);
    }
    
    // 3. Validar Asunto
    if (inputAsunto.value.trim() === '') {
        errorAsunto.textContent = 'El asunto es obligatorio.';
        ponerError(inputAsunto);
        esValido = false;
    } else {
        errorAsunto.textContent = '';
        quitarError(inputAsunto);
    }
    
    // 4. Validar Mensaje
    if (inputMensaje.value.trim() === '') {
        errorMensaje.textContent = 'El mensaje no puede estar vacío.';
        ponerError(inputMensaje);
        esValido = false;
    } else {
        errorMensaje.textContent = '';
        quitarError(inputMensaje);
    }
    
    return esValido;
}

// --- Función para guardar en localStorage ---
function guardarConsultaEnStorage(datosConsulta) {
    let datosString = JSON.stringify(datosConsulta);
    localStorage.setItem('ultimaConsulta', datosString);
    console.log('Consulta guardada en localStorage');
}

// --- Función para mostrar la última consulta ---
function mostrarUltimaConsulta() {
    let consultaGuardada = localStorage.getItem('ultimaConsulta');
    
    if (consultaGuardada) {
        let consulta = JSON.parse(consultaGuardada);
        
        ultimaConsultaDiv.classList.remove('d-none');
        datosUltimaConsulta.innerHTML = `
            <span class="fw-bold">Nombre:</span> ${consulta.nombre}<br>
            <span class="fw-bold">Email:</span> ${consulta.email}<br>
            <span class="fw-bold">Asunto:</span> ${consulta.asunto}<br>
            <span class="fw-bold">Mensaje:</span> ${consulta.mensaje}
        `;
    }
}

// --- EVENTO PRINCIPAL: submit del formulario ---
formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    
    mensajeExito.classList.add('d-none');
    
    if (validarFormulario()) {
        let datosDelFormulario = {
            nombre: inputNombre.value.trim(),
            email: inputEmail.value.trim(),
            asunto: inputAsunto.value.trim(),
            mensaje: inputMensaje.value.trim()
        };
        
        console.log('--- SIMULACIÓN DE ENVÍO DE EMAIL ---');
        console.log('Datos enviados:', datosDelFormulario);
        console.log('-----------------------------------');
        
        guardarConsultaEnStorage(datosDelFormulario);
        
        mensajeExito.classList.remove('d-none');
        formulario.reset();
        mostrarUltimaConsulta();
        
        // Quitar clases de error al resetear
        [inputNombre, inputEmail, inputAsunto, inputMensaje].forEach(input => {
            input.classList.remove('is-invalid');
        });
    }
});

// --- Evento load para mostrar datos guardados ---
window.addEventListener('load', function() {
    console.log('Página de contacto cargada.');
    mostrarUltimaConsulta();
});