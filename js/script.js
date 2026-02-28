// =============================================
// FORMULARIO DE CONTACTO - VALIDACIONES
// =============================================

// Capturar elementos del DOM
const formulario = document.querySelector('#formularioContacto');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const inputAsunto = document.querySelector('#asunto');
const inputMensaje = document.querySelector('#mensaje');

// Elementos para mostrar errores
const errorNombre = document.querySelector('#errorNombre');
const errorEmail = document.querySelector('#errorEmail');
const errorAsunto = document.querySelector('#errorAsunto');
const errorMensaje = document.querySelector('#errorMensaje');

// Elementos para feedback y storage
const mensajeExito = document.querySelector('#mensajeExito');
const ultimaConsultaDiv = document.querySelector('#ultimaConsulta');
const datosUltimaConsulta = document.querySelector('#datosUltimaConsulta');

// Función para validar Email
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

// Función para quitar clase de error de Bootstrap
function quitarError(elemento) {
    elemento.classList.remove('is-invalid');
}

// Función para poner clase de error de Bootstrap
function ponerError(elemento) {
    elemento.classList.add('is-invalid');
}

// Función para validar el formulario completo
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

// Función para guardar en localStorage
function guardarConsultaEnStorage(datosConsulta) {
    let datosString = JSON.stringify(datosConsulta);
    localStorage.setItem('ultimaConsulta', datosString);
    console.log('Consulta guardada en localStorage');
}

// Función para mostrar la última consulta
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

// EVENTO PRINCIPAL: submit del formulario
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

// Evento load para mostrar datos guardados
window.addEventListener('load', function() {
    console.log('Página de contacto cargada.');
    mostrarUltimaConsulta();
    cargarVotosCheckGuardados();
    
    // Verificar si ya votó en esta sesión
    if (localStorage.getItem('yaVotoCheckSesion')) {
        checkboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });
        btnVotarCheck.disabled = true;
        btnVotarCheck.textContent = 'Ya votaste';
    }
});

// =============================================
// ENCUESTA CON CHECKBOX
// =============================================

// Capturar elementos de la encuesta con checkbox
const btnVotarCheck = document.querySelector('#btnVotarCheck');
const checkboxes = document.querySelectorAll('#formularioEncuesta input[type="checkbox"]');
const mensajeGraciasCheck = document.querySelector('#mensajeGraciasCheck');
const resultadoVotosCheck = document.querySelector('#resultadoVotosCheck');
const contenidoResultadoCheck = document.querySelector('#contenidoResultadoCheck');

// Objeto para guardar los votos de checkboxes
let votosCheck = {
    'Sí, muy clara': 0,
    'Más o menos': 0,
    'No, fue confusa': 0,
    'Faltaron ejemplos': 0
};

// Cargar votos guardados al iniciar
function cargarVotosCheckGuardados() {
    let votosGuardados = localStorage.getItem('votosEncuestaCheck');
    if (votosGuardados) {
        votosCheck = JSON.parse(votosGuardados);
        mostrarResultadosCheck();
    }
}

// Guardar votos en localStorage
function guardarVotosCheck() {
    localStorage.setItem('votosEncuestaCheck', JSON.stringify(votosCheck));
}

// Mostrar resultados en la página
function mostrarResultadosCheck() {
    let total = votosCheck['Sí, muy clara'] + 
                votosCheck['Más o menos'] + 
                votosCheck['No, fue confusa'] +
                votosCheck['Faltaron ejemplos'];
    
    if (total > 0) {
        resultadoVotosCheck.classList.remove('d-none');
        
        let html = `
            <div class="mb-2">
                <span class="fw-bold">✅ Sí, muy clara:</span> 
                ${votosCheck['Sí, muy clara']} voto(s) (${Math.round(votosCheck['Sí, muy clara'] * 100 / total)}%)
            </div>
            <div class="mb-2">
                <span class="fw-bold">🔄 Más o menos:</span> 
                ${votosCheck['Más o menos']} voto(s) (${Math.round(votosCheck['Más o menos'] * 100 / total)}%)
            </div>
            <div class="mb-2">
                <span class="fw-bold">❌ No, fue confusa:</span> 
                ${votosCheck['No, fue confusa']} voto(s) (${Math.round(votosCheck['No, fue confusa'] * 100 / total)}%)
            </div>
            <div class="mb-2">
                <span class="fw-bold">📚 Faltaron ejemplos:</span> 
                ${votosCheck['Faltaron ejemplos']} voto(s) (${Math.round(votosCheck['Faltaron ejemplos'] * 100 / total)}%)
            </div>
            <hr>
            <div class="fw-bold">Total de votos: ${total}</div>
        `;
        
        contenidoResultadoCheck.innerHTML = html;
    }
}

// Evento para votar con checkboxes
btnVotarCheck.addEventListener('click', function() {
    let algunaSeleccionada = false;
    let seleccionadas = [];
    
    // Verificar qué checkboxes están seleccionados
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            algunaSeleccionada = true;
            
            // Identificar qué opción se seleccionó según su name
            if (checkbox.name === 'opinion_clara') {
                votosCheck['Sí, muy clara']++;
                seleccionadas.push('Sí, muy clara');
            } else if (checkbox.name === 'opinion_masomenos') {
                votosCheck['Más o menos']++;
                seleccionadas.push('Más o menos');
            } else if (checkbox.name === 'opinion_confusa') {
                votosCheck['No, fue confusa']++;
                seleccionadas.push('No, fue confusa');
            } else if (checkbox.name === 'opinion_ejemplos') {
                votosCheck['Faltaron ejemplos']++;
                seleccionadas.push('Faltaron ejemplos');
            }
        }
    });
    
    if (algunaSeleccionada) {
        // Guardar en localStorage
        guardarVotosCheck();
        
        // Mostrar resultados
        mostrarResultadosCheck();
        
        // Mostrar mensaje de agradecimiento
        mensajeGraciasCheck.classList.remove('d-none');
        
        // Mostrar qué opciones eligió en consola
        console.log('Opciones seleccionadas en encuesta:', seleccionadas);
        
        // Deshabilitar checkboxes y botón
        checkboxes.forEach(checkbox => {
            checkbox.disabled = true;
        });
        btnVotarCheck.disabled = true;
        btnVotarCheck.textContent = 'Gracias por votar';
        
        // Guardar en sesión que ya votó
        localStorage.setItem('yaVotoCheckSesion', 'true');
        
        // Ocultar mensaje de gracias después de 3 segundos
        setTimeout(function() {
            mensajeGraciasCheck.classList.add('d-none');
        }, 3000);
        
    } else {
        alert('Por favor, seleccioná al menos una opción antes de votar.');
    }
});