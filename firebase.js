const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// firebase-firebase package
const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');
const { getFirestore, collection, query , where, getDocs } = require('firebase/firestore');

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


const picturesRef = collection(db, 'pictures');
const albumsRef = collection(db, 'albums');
const usersRef = collection(db, 'users');

async function retrievePictures (userUID)  {
    const q = query(picturesRef, where('user_id', '==', userUID));
    const querySnapshot = await getDocs(q);
    const pictures = [];
    querySnapshot.forEach(doc => {
        pictures.push(doc.data());
    })
    return pictures;
}


module.exports = { firebaseAuth, adminAuth, db, retrievePictures }; //export the app
