const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebase = require('firebase');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQhW9ZGoQNsEOYsXK6MolkRgzupxOgL8E",
    authDomain: "world-of-pictures.firebaseapp.com",
    projectId: "world-of-pictures",
    storageBucket: "world-of-pictures.appspot.com",
    messagingSenderId: "497847256484",
    appId: "1:497847256484:web:d4e29809a90966303ead31",
    databaseURL: "https://world-of-pictures-default-rtdb.europe-west1.firebasedatabase.app/"
};
const firebaseApp = initializeApp(firebaseConfig); //initialize firebase app
const firebaseAuth = getAuth(firebaseApp);

module.exports = { firebase, firebaseAuth }; //export the app