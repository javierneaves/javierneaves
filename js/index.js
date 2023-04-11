import { getFirestore, doc, getDoc, collection, getDocs, query, where, deleteDoc, orderBy, updateDoc, setDoc, addDoc  } from '../firebase/firebaseJs.js'
import { app, auth } from '../firebase/config.js'
import { onAuthStateChanged, updateProfile } from '../firebase/firebaseAuth.js';
// The code imports various functions and modules from the Firebase SDK to interact with the Firestore database and to manage user authentication.
// The db variable is assigned the Firestore instance obtained by calling getFirestore function from Firebase SDK using the app configuration object.
const db = getFirestore(app) 
// The code defines a global object named cerData which is used to store the data related to a certificate when a user clicks on the btnGuardar button.
let cerData = {} 
// The mostrarInputBtn variable selects all the elements on the page with class mostrarInputBtn and the inputFileContainer variable selects the element with id inputFileContainer.
const inputFileContainer = document.querySelector('#inputFileContainer');
const btnGuardar = document.getElementById('btn-guardar')
// The alert function uses the SweetAlert library to show a modal dialog box with a title, message, and confirmation button.
function alert(titulo,contenido,icono,buttonText){
  Swal.fire({
    title: titulo,
    text: contenido,
    icon: icono,
    confirmButtonText: buttonText
  })
  
}

btnGuardar.addEventListener('click', function (e) {
    
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

// BOTON PARA CREAR LAS TARJETAS
const buscarCertificadoBtn = document.getElementById('buscarCertificadoBtn')

buscarCertificadoBtn.addEventListener('click', function (e) {
    e.preventDefault()
    obtenerRango()
    
});

const inputBuscarDesde = document.getElementById('inputBuscarDesde');
const inputBuscarHasta = document.getElementById('inputBuscarHasta');

inputBuscarDesde.addEventListener('input', function (e) {
  if(parseInt(inputBuscarDesde.value) < 0){
    alert('Error', 'No se pueden ingresar numeros negativos','error','OK')
  }
   
});

inputBuscarHasta.addEventListener('input', function (e) {
  if(parseInt(inputBuscarHasta.value) < 0){
    alert('Error', 'No se pueden ingresar numeros negativos','error','OK')
  }
   
});


function obtenerRango(){

  
  const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = ''
    const rango = parseInt(inputBuscarHasta.value) - parseInt(inputBuscarDesde.value)
     if(rango < 0)
     {

        alert('Error','Buscaste desde ' +  parseInt(inputBuscarDesde.value) + ' hasta ' + parseInt(inputBuscarHasta.value) + ' lo que te da un error', 'error', 'OK' )
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


 // Subir imagenes
// google sheet url https://docs.google.com/spreadsheets/d/19b1iGnaLVQ1s09OowTPBOslmMvyWX40ahz08njJDyqI/edit#gid=0
 
 let url = "https://script.google.com/macros/s/AKfycby0hAFi_5zcSxHO6SvdLebgQQHUU9_6Kd0SoyDdgickHzb2H44pZKOcRCqjwr7YdFlr/exec"
 let file =  document.querySelector('#inputFile');

 file.addEventListener('change', function (e) {
   console.log('file change');
   let fr = new FileReader()
   
   fr.addEventListener('loadend', function (e) {
     
     let res = fr.result
     
     let spt = res.split('base64,')[1]
     console.log(file.files[0].type);
     let obj = {
       base64:spt,
       type:file.files[0].type,
       name:'cerDatacer'
     }
     console.log(obj);
     let response =  fetch(url, {
         method:'POST',
         body: JSON.stringify(obj),
       })
     .then(r=>r.text())
     .then(data => {
       console.log(data);
       try {
         const response = JSON.parse(data);
         console.log(response.link);
         
         guardarLinkEnCollecionCertificados(response.link)
       } catch (e) {
         console.error("Error al analizar la respuesta JSON: ", e);
       }
     })
     .catch(err => {
       console.error("Error en la solicitud POST: ", err);
     });
   });
   fr.readAsDataURL(file.files[0])
 });

 async function guardarLinkEnCollecionCertificados(link) {
   try {

     const docRef = await addDoc(collection(db, 'utilityBill'), {
       voltioId: voltioId,
       link: link,
       timestamp: new Date().toISOString()
     }).then(getImagesFromUtilityBillCollection())

   } catch (error) {
     console.error('Error al guardar los datos:', error);
   }
 }
 
 let viewCustomersImageButton = document.getElementById('viewCustomersImageButton');
 viewCustomersImageButton.addEventListener('click', function (e) {
   getImagesFromUtilityBillCollection()
 });

 async function getImagesFromUtilityBillCollection(){
   const billsCol = collection(db, 'utilityBill');
   const q = query(billsCol, where('voltioId', '==', voltioId));
   const querySnapshot = await getDocs(q);
   const bills = querySnapshot.docs.map((doc) => doc.data());
   console.log(bills);
   //generateUtilityBillImagesHTML(bills)
   const thumbnailElements = bills.map((thumbnail) => generateThumbnail(thumbnail.link, thumbnail.voltioId));
   insertThumbnails(thumbnailElements);
   
 }

 function generateUtilityBillImagesHTML(array) {
   const container = document.getElementById('utilityBillImagesContainer');
   container.innerHTML = ""
   array.forEach(item => {
     const div = document.createElement('div');
     div.className = 'col-sm-6 col-md-3';
     
     const thumbnail = document.createElement('div');
     thumbnail.className = 'thumbnail';
     
     const img = document.createElement('img');
     img.src = item.link;
     img.alt = item.voltioId;
     img.className = 'img-thumbnail mb-2';
     img.addEventListener("click", () => {
       window.open(item.link);
     });
     thumbnail.appendChild(img);
     div.appendChild(thumbnail);
     
     container.appendChild(div);
   });
 }

 function generateThumbnail(link, voltioId) {
   const thumbnailDiv = document.createElement('div');
   thumbnailDiv.classList.add('col-sm-6', 'col-md-3');
 
   const thumbnail = document.createElement('div');
   thumbnail.classList.add('thumbnail');
 
   const image = document.createElement('img');
   image.classList.add('img-thumbnail', 'mb-2');
   image.src = link;
   image.alt = voltioId;
 
   const closeButton = document.createElement('button');
   closeButton.classList.add('close');
   closeButton.innerHTML = '&times;';
   closeButton.addEventListener('click', () => thumbnailDiv.remove());
 
   thumbnail.appendChild(image);
   thumbnail.appendChild(closeButton);
   thumbnailDiv.appendChild(thumbnail);
 
   image.addEventListener('click', () => window.open(link, '_blank'));
 
   return thumbnailDiv;
 }
 
 function insertThumbnails(thumbnails) {
   const container = document.getElementById('utilityBillImagesContainer');
   const customerFilesUpload = document.getElementById('customerFilesUpload');
   customerFilesUpload.value = ''
   container.innerHTML = ''
   thumbnails.forEach((thumbnail) => container.appendChild(thumbnail));
 }
 