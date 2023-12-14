// ------------------------------------------------------ INITIALIZE FIREBASE
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} = require("firebase/auth");
const { getFirestore, getDoc, Timestamp, collection, query , where, getDocs,setDoc,doc } = require('firebase/firestore');
const { getStorage, ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");

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

async function logOut() {
    return firebaseAuth.signOut().then(() => {
        updateUID(null);
        return true;

    }).catch((error) => {
        console.log(error);
        return false;
    });

}

async function createNewUser(emailValue,passwordValue,firstnameValue,lastnameValue){
    return createUserWithEmailAndPassword(firebaseAuth,emailValue,passwordValue)
        .then((userCredential) => {
            const user = userCredential.user;
            createUserInDB(user.uid, firstnameValue, lastnameValue, emailValue);
            createDefaultAlbum(user.uid);
            return true

        }).catch((error) => {
            console.log(error);
            return false;
        });
}

// ------------------------------------------------------ FIRESTORE / STORAGE
const db = getFirestore(firebaseApp);

const storage = getStorage(firebaseApp);


const picturesRef = collection(db, 'pictures');
const albumsRef = collection(db, 'albums');
const usersRef = collection(db, 'users');

// ------------------------------------------------------ USER FUNCTIONS
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
async function createDefaultAlbum(userUID) {
    return setDoc(doc(albumsRef), {
        album_name: 'Default',
        date_created: Timestamp.fromDate(new Date()),
        user_id: userUID
    })
        .then(() => {
            console.log('album uploaded');
            return true
        })
        .catch((error) => {
            console.log(error);
            return false
        });
}

// ------------------------------------------------------ PICTURE FUNCTIONS

async function retrievePictures(userUID) {
    let pictures = [];
    const q = query(picturesRef, where('user_id', '==', userUID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        let pic = doc.data();
        pic.date_created = new Date(doc.data().date_created.seconds * 1000 + doc.data().date_created.nanoseconds / 1000000);
        pictures.push(pic);
    });

    return pictures;
}
async function uploadPictureToStorage(file) {
    const date = new Date().toISOString().slice(0, 19).replace('T', '-').replaceAll(':', '');
    const storageRef = ref(storage, 'pictures/' + date + "-" + file.originalname);

    const type = file.originalname.includes('.png') ? 'png' :
        file.originalname.includes('.jpg') ? 'jpg' :
            file.originalname.includes('.jpeg') ? 'jpeg' :
                file.originalname.includes('.gif') ? 'gif' :
                    file.originalname.includes('.svg') ? 'svg' :
                        'unknown';

    const metadata = {
        contentType: "image/" + type
    };

    const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error);
            },
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    reject(error);
                });
            }
        );
    });
}
async function uploadPictureToDB(data, userUID) {
    return setDoc(doc(picturesRef), {
        img_name: data.img_name,
        img_path: data.img_path,
        date_created: Timestamp.fromDate(new Date(data.date_created)),
        album_id: data.album_id,
        city: data.city,
        country: data.country,
        favorite: data.favorite,
        tags: data.tags,
        alt_text: data.alt_text,
        user_id: userUID
    })
        .then(() => {
            console.log('picture uploaded');
            return true
        })
        .catch((error) => {
            console.log(error);
            return false
        });
}
// COUNTRY DATA
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

// ------------------------------------------------------ ALBUM FUNCTIONS
async function retrieveAlbums(userID){
    let albums = [];
    const q = query(albumsRef, where('user_id','==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        albums.push({
            data: doc.data(),
            id: doc.id
        });
    })
    return albums.sort((a, b) => a.data.album_name.toLowerCase() > b.data.album_name.toLowerCase() ? 1 : -1);
}

async function uploadAlbumToDb(data, userUID) {
    return setDoc(doc(albumsRef), {
        album_name: data.album_name,
        date_created: Timestamp.fromDate(new Date(data.date_created)),
        user_id: userUID
    })
        .then(() => {
            console.log('album uploaded');
            return true
        })
        .catch((error) => {
            console.log(error);
            return false
        });
}

async function renameAlbum(albumID, newName, uid) {
    const albumRef = doc(db, 'albums', albumID);
    return  getDoc(albumRef).then((doc) => {
        if (doc.exists && doc.data().user_id === uid) {
            return setDoc(albumRef, {album_name: newName}, {merge: true})
                .then(() => {
                    console.log('album renamed');
                    return true
                })
                .catch((error) => {
                    console.log(error);
                    return false
                });
        } else {
            console.log("No such album!");
            return false;
        }
    }).catch((error) => {
        console.log("Error getting album:", error);
        return false;
    });
}

// ------------------------------------------------------ EXPORTS
module.exports = { authenticateLogin, monitorAuthState, logOut, createNewUser, retrievePictures, uploadPictureToStorage, uploadPictureToDB, retrieveCountryData, retrieveAlbums,uploadAlbumToDb, renameAlbum }; //export the app
