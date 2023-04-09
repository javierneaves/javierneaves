      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {

            apiKey: "AIzaSyAg1ut16-vGXrU7_WY1BQmcFRnswQZzRZE",
          
            authDomain: "almacen-sime.firebaseapp.com",
          
            projectId: "almacen-sime",
          
            storageBucket: "almacen-sime.appspot.com",
          
            messagingSenderId: "237982376467",
          
            appId: "1:237982376467:web:bb3eec32d8614ba38795e6"
          
          };
          
          

      // Initialize Firebase
      export const app = initializeApp(firebaseConfig);
      export const auth = getAuth(app)