const nameInput = document.querySelector('#name');
const surnameInput = document.querySelector('#surname');
const dateInput = document.querySelector('#date');
const timeInput = document.querySelector('#time');
const phoneInput = document.querySelector('#phone');
const symptomInput = document.querySelector('#symptom');

const form = document.querySelector('#formulario');
const result = document.querySelector('#result');

const dataPacient = {
    name: '',
    surname: '',
    date: '',
    time: '',
    phone: '',
    symptom: '',
    id: Date.now()
}

let editando;

//Events

addEvents();
function addEvents(){
    nameInput.addEventListener('blur', dataObject);
    surnameInput.addEventListener('blur', dataObject);
    dateInput.addEventListener('blur', dataObject);
    timeInput.addEventListener('blur', dataObject);
    phoneInput.addEventListener('blur', dataObject);
    symptomInput.addEventListener('blur', dataObject);

    form.addEventListener('submit', newVisit);
}

//EVENT FOR LOCALSTORAGE USE
document.addEventListener('DOMContentLoaded', () => {
    visit.visitsArray = JSON.parse(localStorage.getItem('visits')) || [];

    ui.showPacients(visit.visitsArray);
})


//Classes
class Visits{
    constructor(){
        this.visitsArray = [];
    }

    addVisit(pacientObject){
        this.visitsArray.push(pacientObject);
    }

    deletePacient(id){
        this.visitsArray = visit.visitsArray.filter(pacient => pacient.id !== id);
        ui.showPacients(visit.visitsArray);
        ui.showAlert('Eliminado correctamente', 'successfuly');
    }

    edit(updateObject){
        this.visitsArray = this.visitsArray.map(pacient => {
            if(pacient.id === updateObject.id){
                return updateObject;
            }else{
                return pacient;
            }
        })
    }
}

class Ui{
    showAlert(message, type){
        const alertContainer = document.querySelector('.app__form');

        const alertExists = document.querySelector('.alert');
        if(alertExists){
            alertExists.remove();
        }

        const alertDiv = document.createElement('DIV');
        alertDiv.classList.add('alert');
        alertDiv.textContent = message;

        if(type === 'error'){
            alertDiv.classList.add('error');
        }else if(type === 'successfuly'){
            alertDiv.classList.add('successfuly');
        }else{
            alertDiv.classList.add('edited');
        }

        alertContainer.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    showPacients(visitsArray){
        clearHTML();

        visitsArray.forEach(pacient => {
            console.log(pacient);
            const {name, surname, date, time, phone, symptom, id} = pacient;

            const li = document.createElement('LI');
            li.classList.add('li-pacient')

            const liWhen = document.createElement('DIV');
            liWhen.classList.add('li-when');

            const dateSpan = document.createElement('SPAN');
            dateSpan.classList.add('li-date');
            dateSpan.textContent = date;

            const timeSpan = document.createElement('SPAN');
            timeSpan.classList.add('li-time');
            timeSpan.textContent = time;

            //Pacient data html
            const pacientName = document.createElement('P');
            pacientName.classList.add('li-pacient-item');
            pacientName.textContent = 'Paciente: ';

            const pacientNameSpan = document.createElement('SPAN');
            pacientNameSpan.textContent = `${name} ${surname}`;

            const pacientPhone = document.createElement('P');
            pacientPhone.classList.add('li-pacient-item');
            pacientPhone.textContent = 'Teléfono: ';

            const pacientPhoneSpan = document.createElement('SPAN');
            pacientPhoneSpan.textContent = phone;

            const pacientSymptoms = document.createElement('P');
            pacientSymptoms.classList.add('li-pacient-item');
            pacientSymptoms.textContent = 'Síntomas: '

            const pacientSymptomsSpan = document.createElement('SPAN');
            pacientSymptomsSpan.textContent = symptom;

            const btnEdit = document.createElement('BUTTON');
            btnEdit.classList.add('btn-edit');
            btnEdit.innerHTML = `Editar <i class="bi bi-pencil"></i>`;
            btnEdit.onclick = function() {
                editVisit(pacient);
            }

            const btnDelete = document.createElement('BUTTON');
            btnDelete.classList.add('btn-delete');
            btnDelete.innerHTML = `Eliminar <i class="bi bi-trash"></i>`;
            btnDelete.onclick = function() {
                visit.deletePacient(id);
            }


            //Append scripting
            liWhen.appendChild(dateSpan);
            liWhen.appendChild(timeSpan);

            li.appendChild(liWhen);

            pacientName.appendChild(pacientNameSpan);
            pacientPhone.appendChild(pacientPhoneSpan);
            pacientSymptoms.appendChild(pacientSymptomsSpan);

            li.appendChild(pacientName);
            li.appendChild(pacientPhone);
            li.appendChild(pacientSymptoms);

            li.appendChild(btnEdit);
            li.appendChild(btnDelete);

            result.appendChild(li);
        });

        sincronizeLs();

    }
}

//instance the classes
const ui = new Ui();
const visit = new Visits();

//Functions
function dataObject(e) {
    //fill the object with client information
    dataPacient[e.target.name] = e.target.value;
}


function newVisit(e) {
    //valid the form
    e.preventDefault();
    
    if(Object.values(dataPacient).includes('')){
        ui.showAlert('Por favor completa los campos', 'error');
        return;
    }
    
    //edition mode
    if(editando === true){
        ui.showAlert('Editado correctamente', 'edited');
        
        visit.edit({...dataPacient});
        
        form.querySelector('button[type="submit"]').value = 'Crear cita';

        editando = false;
    }else{
        //fill the array with client data
        visit.addVisit({...dataPacient});

        ui.showAlert('Agregado correctamente', 'successfuly');
    }
    
    //reset the object
    resetObject();
    
    form.reset();
    
    ui.showPacients(visit.visitsArray);
}




function editVisit(pacientObject){
    const {name, surname, phone, date, time, symptom, id} = pacientObject;

    //fill the form again
    nameInput.value = name;
    surnameInput.value = surname;
    phoneInput.value = phone;
    dateInput.value = date;
    timeInput.value = time;
    symptomInput.value = symptom;

    //fill the object again with the same data
    dataPacient.name = name;
    dataPacient.surname = surname;
    dataPacient.phone = phone;
    dataPacient.date = date;
    dataPacient.time = time;
    dataPacient.symptom = symptom;
    dataPacient.id = id;

    //change the button text
    form.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}


function resetObject() {
    dataPacient.name = '';
    dataPacient.surname = '';
    dataPacient.phone = '';
    dataPacient.date = '';
    dataPacient.time = '';
    dataPacient.id = Date.now();
}

function clearHTML(){
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }
}


function sincronizeLs(){
    localStorage.setItem('visits', JSON.stringify(visit.visitsArray));
}