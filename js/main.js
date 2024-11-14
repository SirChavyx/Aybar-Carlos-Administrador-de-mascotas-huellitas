// Selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const contenedorCitas = document.querySelector('#citas');

// Eventos
pacienteInput.addEventListener('change', datosCitas);
propietarioInput.addEventListener('change', datosCitas);
emailInput.addEventListener('change', datosCitas);
fechaInput.addEventListener('change', datosCitas);
sintomasInput.addEventListener('change', datosCitas);

formulario.addEventListener('submit', submitCita);
let editando = false;

// Objeto de cita
const citaObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
};

// Clases
class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto;
        this.tipo = tipo;

        this.mostrar();
    }

    mostrar() {
        // Crear la notificación
        const alerta = document.createElement('DIV');
        alerta.classList.add('div-alert');

        // Eliminar Alertas duplicadas
        const alertaPrevia = document.querySelector('.div-alert');
        if (alertaPrevia) {
            alertaPrevia.remove();
        }

        // Si es de tipo error, se agrega una clase
        this.tipo === 'error' ? alerta.classList.add('alert-red') : alerta.classList.add('alert-green');

        // Mensaje de error
        alerta.textContent = this.texto;

        // Insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario);

        // Quitar alerta después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

class AdminCitas {
    constructor() {
        this.citas = [];
    }

    agregar(cita) {
        this.citas = [...this.citas, cita];
        this.mostrar();
    }
    
    editar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita )
        this.mostrar()
    }
    eliminar(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
        this.mostrar()
    }

    mostrar() {
        // Limpiar el HTML
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        // Si hay citas
        if (this.citas.length === 0) {
            contenedorCitas.innerHTML = ' <p class="no-paciente">No Hay Pacientes</p>'
        }

        // Generando las citas
        this.citas.forEach((cita) => {
            const divCitas = document.createElement('DIV');
            divCitas.classList.add('div-citas');

            const paciente = document.createElement('P');
            paciente.classList.add('clase-paciente');
            paciente.innerHTML = `<span class="span-bold">Paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('P');
            propietario.classList.add('clase-paciente');
            propietario.innerHTML = `<span class="span-bold">Propietario: </span> ${cita.propietario}`;

            const email = document.createElement('P');
            email.classList.add('clase-paciente');
            email.innerHTML = `<span class="span-bold">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('P');
            fecha.classList.add('clase-paciente');
            fecha.innerHTML = `<span class="span-bold">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('P');
            sintomas.classList.add('clase-paciente');
            sintomas.innerHTML = `<span class="span-bold">Síntomas: </span> ${cita.sintomas}`;

            // Botones de eliminar y editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn-edit');
            btnEditar.innerHTML = 'Editar';
            const clone = { ...cita };
            btnEditar.onclick = () => cargarEdicion(clone);

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn-clear');
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => this.eliminar(cita.id);

            // Contenedor de botones
            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex-btn');
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            // Agregando al HTML
            divCitas.appendChild(paciente);
            divCitas.appendChild(propietario);
            divCitas.appendChild(email);
            divCitas.appendChild(fecha);
            divCitas.appendChild(sintomas);
            divCitas.appendChild(contenedorBotones);
            contenedorCitas.appendChild(divCitas);
        });
    }

    eliminar(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrar();
    }
}

function datosCitas(e) {
    citaObj[e.target.id] = e.target.value;
}

const citas = new AdminCitas();

function submitCita(e) {
    e.preventDefault();
    console.log(citaObj);

    if (Object.values(citaObj).some((valor) => valor.trim() === '')) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        });
        return;
    }

    if (editando){
        citas.editar({...citaObj})
        new Notificacion({
            texto: 'Guardado correctamente',
            tipo: 'exito'
        });

    }else{
        citas.agregar({ ...citaObj});
        new Notificacion({
            texto: 'Paciente Registrado',
            tipo: 'exito'
        });
    }

    
    formulario.reset();
    reiniciarObjetoCita();
   
}

function reiniciarObjetoCita() {
    citaObj.id = generarId();
    citaObj.paciente = '';
    citaObj.propietario = '';
    citaObj.email = '';
    citaObj.fecha = '';
    citaObj.sintomas = '';
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita) {
    Object.assign(citaObj, cita)

    // Rellenar los inputs con los datos de la cita a editar
    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true

    // Actualizar el objeto de cita
    citaObj.id = cita.id;
    citaObj.paciente = cita.paciente;
    citaObj.propietario = cita.propietario;
    citaObj.email = cita.email;
    citaObj.fecha = cita.fecha;
    citaObj.sintomas = cita.sintomas;
}
