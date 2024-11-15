const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');
const contenedorcitas = document.querySelector('#citas')

// eventos
pacienteInput.addEventListener('change', datoscitas);
propietarioInput.addEventListener('change', datoscitas);
emailInput.addEventListener('change', datoscitas);
fechaInput.addEventListener('change', datoscitas);
sintomasInput.addEventListener('change', datoscitas);

formulario.addEventListener('submit', submitcita);
let editando = false;

 // objeto cita
 const citaobj={
    id: generarId(),
    paciente:'',
    propietario:'',
    email:'',
    fecha:'',
    sintomas:''
}
// clases
class Notificacion{
    constructor({texto,tipo}){
        this.texto = texto
        this.tipo = tipo

        this.mostrar();
    }
    mostrar(){
        const alerta = document.createElement('DIV')
        alerta.classList.add('div-alert')

        const alertaprevia = document.querySelector('.div-alert')
        if (alertaprevia){
            alertaprevia.remove();
        }

        this.tipo === 'error' ? alerta.classList.add('alert-red') : alerta.classList.add('alert-green')
        
        alerta.textContent = this.texto

        formulario.parentElement.insertBefore(alerta,formulario)
        
        setTimeout(() => {
            alerta.remove()
        }, 3000);

    }
}

class admincitas{
    constructor(){
        this.citas= [];

    }
    agregar(cita) {
        this.citas = [...this.citas,cita]
        this.mostrar();
       
    }

    editar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar() 
    }
    eliminar(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
        this.mostrar()
    }

    mostrar(){
        while (contenedorcitas.firstChild){
            contenedorcitas.removeChild(contenedorcitas.firstChild);
        }
        if (this.citas.length === 0) {
            contenedorcitas.innerHTML = '<p class="no-paciente">No Hay Pacientes</p>'
        }

        this.citas.forEach((cita)=>{
            const divCitas = document.createElement('DIV');
            divCitas.classList.add('div-citas')

            const paciente = document.createElement('p');
            paciente.classList.add('clase-paciente');
            paciente.innerHTML = `<span class="span-bold">paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('p');
            propietario.classList.add('clase-paciente');
            propietario.innerHTML = `<span class="span-bold">propietario: </span> ${cita.propietario}`;

            const email  = document.createElement('p');
            email.classList.add('clase-paciente');
            email.innerHTML = `<span class="span-bold">email: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('clase-paciente');
            fecha.innerHTML = `<span class="span-bold">fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('clase-paciente');
            sintomas.innerHTML = `<span class="span-bold">sintomas: </span> ${cita.sintomas}`;

            const btnEditar =document.createElement('button');
            btnEditar.classList.add('btn-edit')
            btnEditar.innerHTML = 'editar'
            const clone = {...cita}
            btnEditar.onclick = () => cargarEdicion (clone)
            


            const btnEliminar =document.createElement('button');
            btnEliminar.classList.add('btn-clear')
            btnEliminar.innerHTML = 'eliminar'
            btnEliminar.onclick  = () => this.eliminar(cita.id)


            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex-btn')

            contenedorBotones.appendChild(btnEditar)
            contenedorBotones.appendChild(btnEliminar)

            divCitas.appendChild(paciente);
            divCitas.appendChild(propietario);
            divCitas.appendChild(email);
            divCitas.appendChild(fecha);
            divCitas.appendChild(sintomas);
            divCitas.appendChild(contenedorBotones);
            contenedorcitas.appendChild(divCitas);
            
        })
    }
}
// funciones
function datoscitas(e) {
    citaobj[e.target.name] = e.target.value;
}
const citas = new admincitas(); 

function submitcita(e) {
    e.preventDefault();
     
    if (Object.values(citaobj).some((valor) => valor.trim() ==='')) {
       const notificacion = new Notificacion({
        texto:'todos los campos son obligatorios',
        tipo:'error'
       })
        return
    }

    if (editando) {
        citas.editar({...citaobj})
        new Notificacion({
            texto: 'guardado correctamente',
            tipo: 'exito'
        });
        editando = false;
    }else{
        citas.agregar({...citaobj})
        new Notificacion({
            texto: 'paciente regristrado',
            tipo: 'exito'
        });
    }

    
    formulario.reset()
    reiniciarObjetoCita();
    
}
function reiniciarObjetoCita(){
    citaobj.id = generarId();
    citaobj.paciente = '';
    citaobj.propietario = '';
    citaobj.email = '';
    citaobj.fecha = '';
    citaobj.sintomas = '';
}



function generarId() {
    return Math.random().toString(36).substring(2)  + Date.now().toString(36);
}
function cargarEdicion(cita) {
    Object.assign(citaobj, {...cita})

    pacienteInput.value = cita.paciente
    propietarioInput.value = cita.propietario
    emailInput.value = cita.email
    fechaInput.value = cita.fecha
    sintomasInput.value = cita.sintomas

    editando = true
}