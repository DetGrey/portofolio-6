// ------------------------------------------------------ INITIALIZE FIREBASE
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} = require("firebase/auth");
const { getFirestore, collection, query , where, getDocs,setDoc,doc } = require('firebase/firestore');
const { getStorage, ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");

// firebase-firebase package
// const { initializeApp: initializeAdminApp } = require('firebase-admin/app');
// const firebase = require("firebase-admin");
// const serviceAccount = require("./serviceKey.json");
// Initialize firebase-firebase
// const adminApp = initializeAdminApp({
//     credential: firebase.credential.cert(serviceAccount)
// });

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

// ------------------------------------------------------ FIREBASE AUTHENTICATION
const firebaseAuth = getAuth(firebaseApp);
const { updateUID } = require('./app.js');

async function authenticateLogin(emailValue, passwordValue) {
    return signInWithEmailAndPassword(firebaseAuth, emailValue, passwordValue)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            updateUID(user.uid);
            return true;

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            sessionStorage.removeItem("sessionPictures");
            updateUID(null);
            return false;
        });
}

async function createNewUser(emailValue,passwordValue,firstnameValue,lastnameValue){
    return createUserWithEmailAndPassword(firebaseAuth,emailValue,passwordValue)
        .then((userCredential) => {
            const user = userCredential.user;
            createUserInDB(user.uid, firstnameValue, lastnameValue, emailValue);
            return true

        }).catch((error) => {
            console.log(error);
            return false;
        });
}

async function logOut() {
    return firebaseAuth.signOut().then(() => {
        updateUID(null);
        return true;

    }).catch((error) => {
        console.log(error);
        return false;
    });

}

async function monitorAuthState() {
    let signedIn = false;
    await onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            updateUID(user.uid);
            signedIn = true;
        } else {
            // User is signed out
            updateUID(null);
        }
    });
    return signedIn;
}

// ------------------------------------------------------ FIRESTORE / STORAGE
const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);
const storageRef = ref(storage, 'pictures');

const picturesRef = collection(db, 'pictures');
const albumsRef = collection(db, 'albums');
const usersRef = collection(db, 'users');

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

async function retrievePictures(userUID) {
    let pictures = [];
    const q = query(picturesRef, where('user_id', '==', userUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        pictures.push(doc.data());
    });

    return pictures;
}

async function retrieveCountryData(data) {
    const countryData = [];

    data.forEach(doc => {
        if (countryData.some(x => x.name === doc.country)) {
            countryData.forEach(object => {
                if (object.name === doc.country) {
                    object.count++;
                }
            });
        }
        else {
            countryData.push({
                "name": doc.country,
                "count": 1
            })
        }
    });
    return countryData;

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

async function uploadPictureToDB(fileItem, fileName) {
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (error) => {
            console.log(error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                return downloadURL;
            }).catch((error) => {
                console.error('Error getting download URL:', error);
                return false;
            });
        }
    );
}

module.exports = { authenticateLogin, monitorAuthState, logOut, createNewUser, db, retrievePictures, uploadPictureToDB, retrieveCountryData, retrieveAlbums }; //export the app
