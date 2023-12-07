const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// firebase-firebase package
const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const firebase = require("firebase-admin");

const serviceAccount = require("./serviceKey.json");

// Initialize firebase-firebase
const adminApp = initializeAdminApp({
    credential: firebase.credential.cert(serviceAccount)
});
const adminAuth = getAdminAuth(adminApp);

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
const db = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);


const recentPictures = document.querySelector('#recent-pictures');
const picturesRef = db.collection('pictures');
const albumsRef = db.collection('albums');
const usersRef = db.collection('users');

const renderPictures = async (req, res) => {
    try{
        picturesRef.get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
                const img = document.createElement('img');
                img.src = doc.data().img_path;
                recentPictures.appendChild(img);
            });
        })
    } catch (error) {
        return res
            .status(500)
            .json({ general: "Something went wrong, please try again"});
    }
};




module.exports = { firebaseAuth, adminAuth, db, renderPictures }; //export the app
