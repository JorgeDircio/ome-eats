import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDa9mdm3nQulvzzkIGgFd1jJqCYYx2ZB7Q",
  authDomain: "omeeast.firebaseapp.com",
  projectId: "omeeast",
  storageBucket: "omeeast.appspot.com",
  messagingSenderId: "858497871853",
  appId: "1:858497871853:web:3d5817ead9ab231fc341e4"
};
// Initialize Firebase
export const firebaseapp = firebase.initializeApp(firebaseConfig);