import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
const db = getFirestore(app) 
console.log('Hola');
let cerData = {} 

const mostrarInputBtn = document.querySelectorAll('.mostrarInputBtn');
const inputFileContainer = document.querySelector('#inputFileContainer');
const btnGuardar = document.getElementById('btn-guardar')

btnGuardar.addEventListener('click', function (e) {
    cerData = {} 
    cerData.cer = e.target.dataset.cer 
    if (e.target.dataset.status === 'Entrada') {
      console.log(e.target.dataset.status);
      cerData.status = 'fechaEntrada'
    } else {
      console.log(e.target.dataset.status);
      cerData.status = 'fechaSalida'
    }
    
    cerData.textComment = e.target.dataset.text

    console.log('cerData.status: ' + cerData.status);
    console.log(cerData);
    almacenarDatos()
});

mostrarInputBtn.forEach(function(item) {
    item.addEventListener('click', () => {
      inputFileContainer.classList.toggle('d-none');
      });
});

// BOTON PARA CREAR LAS TARJETAS
const buscarCertificadoBtn = document.getElementById('buscarCertificadoBtn')

buscarCertificadoBtn.addEventListener('click', function (e) {
    e.preventDefault()
    obtenerRango()
    
});

const inputBuscarDesde = document.getElementById('inputBuscarDesde');
const inputBuscarHasta = document.getElementById('inputBuscarHasta');

function obtenerRango(){
  const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''
    const rango = parseInt(inputBuscarHasta.value) - parseInt(inputBuscarDesde.value)
     if(rango < 0)
     {
        console.log("error");
     }else{
        for (let index = 0; index <= rango; index++) {

            crearTarjetas(parseInt(inputBuscarDesde.value) + index)
            
        }
     }
   
     const textAreaComments = document.querySelectorAll('.txtComentarios')
     textAreaComments.forEach(function(item){
        
        item.addEventListener('blur', function(e){
          let cer =  e.target.dataset.cer
          let textComment =  e.target.value
          cerData.cer = cer
          cerData.textComment = textComment
           btnGuardar.dataset.text = textComment
          almacenarDatos()
       })
     });
     
     const btnEntrada = document.querySelectorAll('.btnEntrada')

     btnEntrada.forEach(function(item) {

      item.addEventListener('click', function(e){
        btnGuardar.dataset.cer = e.target.dataset.cer
        btnGuardar.dataset.status = 'Entrada'

      })
      // body
     });

     const btnSalida = document.querySelectorAll('.btnSalida')
     btnSalida.forEach(function(item) {

      item.addEventListener('click', function(e){
        btnGuardar.dataset.cer = e.target.dataset.cer
        btnGuardar.dataset.status = 'Salida'

      })
      // body
     });

}


function crearTarjetas(cerNumber){
    let cer = cerNumber < 10 ? 'CER-23-000' + cerNumber : cerNumber <100 ? 'CER-23-00' + cerNumber : 
    cerNumber < 1000?  'CER-23-0' + cerNumber : 'CER-23-' + cerNumber 
    const cardContainer = document.getElementById('card-container');
    
    const card = document.createElement('div');
    card.classList.add('card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.textContent = cer;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const contenedorBtn = document.createElement('div')
    contenedorBtn.classList.add('d-grid','gap-2', 'mb-3')


    const btnSuccess = document.createElement('button');
    btnSuccess.classList.add('btn', 'btn-outline-success', 'btn-block' , 'btnEntrada');
    btnSuccess.textContent = 'Entrada';
    btnSuccess.dataset.cer = cer
    btnSuccess.setAttribute('data-bs-toggle', 'modal');
    btnSuccess.setAttribute('data-bs-target', '#exampleModal');

    const btnPrimary = document.createElement('button');

    btnPrimary.classList.add('btn', 'btn-outline-primary', 'btn-block', 'btnSalida');
    btnPrimary.textContent = 'Salida';
    btnPrimary.dataset.cer = cer
    btnPrimary.setAttribute('data-bs-target', '#exampleModal');
    btnPrimary.setAttribute('data-bs-toggle', 'modal');


    const textarea = document.createElement('textarea');
    textarea.classList.add('form-control', 'txtComentarios');
    textarea.setAttribute('placeholder', 'Comentarios');
    textarea.setAttribute('rows', '3');
    textarea.dataset.cer = cer

    cardBody.appendChild(contenedorBtn);
    contenedorBtn.appendChild(btnSuccess);
    contenedorBtn.appendChild(btnPrimary);
    cardBody.appendChild(textarea);
  

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    cardContainer.appendChild(card)
}

function guardar() {
    console.log('change');
    // Obtener el input de tipo file
    const inputFile = document.getElementById('inputFile');
  console.log(inputFile.files);
    // Obtener el contenedor para mostrar las imágenes
    const previewContainer = document.getElementById('gallery');
    previewContainer.innerHTML = '';
  
    // Recorrer los archivos seleccionados y mostrarlos
    for (let i = 0; i < inputFile.files.length; i++) {
      const file = inputFile.files[i];
  
      // Crear un elemento de imagen
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.width = 100;
      img.className = ''
  
      // Agregar la imagen al contenedor de vistas previas
      previewContainer.appendChild(img);
    }
    /*
    // Cerrar el modal
    const modal = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    */
  }
  

  async function almacenarDatos() {
    try {
      // Consultar si el certificado ya existe
      let fechaEntrada
      let fechaSalida
      const q = query(collection(db, "certificados"), where("cerNombre", "==", cerData.cer));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(element => {
        
        if(cerData.status === "fechaEntrada"){
          console.log('click entrada existe');
          console.log(cerData);
          fechaEntrada = !element.data().fechaEntrada ? new Date() :  element.data().fechaEntrada
          fechaSalida = !element.data().fechaSalida ? '' :  element.data().fechaSalida
        }else{
          console.log('click salida existe');
          console.log(cerData);
          fechaEntrada = !element.data().fechaEntrada ? "" :  element.data().fechaEntrada
          fechaSalida = !element.data().fechaSalida ? new Date() :  element.data().fechaSalida
        }
       console.log(fechaEntrada);
      
      }); 
      let comentario = !cerData.textComment ? "" : cerData.textComment 
      
      // Si el certificado existe, actualizarlo
      if (querySnapshot.docs.length > 0) {
        const certificadoDoc = doc(db, "certificados", querySnapshot.docs[0].id);
        await updateDoc(certificadoDoc, {
         cerNombre: cerData.cer,
         comentario: comentario,
          fechaEntrada: fechaEntrada,
          fechaSalida: fechaSalida
         

        });
        console.log("Certificado actualizado en Firestore.");
      } 
      // Si el certificado no existe, crear uno nuevo
      else {
        console.log(cerData);
        if(cerData.status = "fechaEntrada"){
          console.log('click Entrada');
          fechaEntrada = new Date() 
          fechaSalida = '' 
        }else{
          console.log('click Salida');
          fechaEntrada =""
          fechaSalida =  new Date() 
        }
       console.log(fechaEntrada);
        const newCertificado = {
         cerNombre: cerData.cer,
         comentario: comentario,
         fechaEntrada: fechaEntrada,
         fechaSalida : fechaSalida

         
        };
         let cerNom = cerData.cer
        const newCertificadoDoc = doc(db, "certificados", cerNom);
        await setDoc(newCertificadoDoc, newCertificado);
        console.log("Certificado almacenado en Firestore.");
      }
    } catch (e) {
      console.error("Error al almacenar el certificado en Firestore: ", e);
    }
  }


 