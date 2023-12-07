const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// firebase-admin package
const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const admin = require("firebase-admin");

const serviceAccount = require("../serviceKey.json");

// Initialize firebase-admin
const adminApp = initializeAdminApp({
    credential: admin.credential.cert(serviceAccount)
});
const adminAuth = getAdminAuth(adminApp);
const db = getFirestore();

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

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

module.exports = { firebaseAuth, adminAuth, db }; //export the app