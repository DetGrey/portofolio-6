const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

// firebase-firebase package
const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');
const { getFirestore, collection, query , where, getDocs,setDoc,doc } = require('firebase/firestore');

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



async function retrievePictures(userUID) {
    let pictures = [];
    const q = query(picturesRef, where('user_id', '==', userUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        pictures.push(doc.data());
    });

    return pictures;
}



async function retrieveAlbums(userID){
    let albums = [];
    const q = query(albumsRef, where('user_id','==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        albums.push(doc.data());
    });

    return albums;
}

async function createUserInDB (uid, firstName, lastName, signupEmail) {
    await setDoc(doc(usersRef), {
        first_name: firstName,
        last_name: lastName,
        email: signupEmail,
        uid: uid
    })
        .then(() => {
            console.log('document uploaded')
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = { firebaseAuth, adminAuth, db, retrievePictures,createUserInDB,retrieveAlbums }; //export the app
