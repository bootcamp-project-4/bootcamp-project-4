// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeqwIEXQZZl5eWoXejhlqm_VrRoaBlikA",
    authDomain: "project-4-earthquake-heros.firebaseapp.com",
    projectId: "project-4-earthquake-heros",
    storageBucket: "project-4-earthquake-heros.appspot.com",
    messagingSenderId: "1069381726964",
    appId: "1:1069381726964:web:e42f25edc178a4c6bfe4a1"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase;