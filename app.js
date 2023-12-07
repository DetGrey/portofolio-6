const express = require('express');
const app = express();
const PORT = 5050;
let userUID = null;

const { signInWithEmailAndPassword,onAuthStateChanged } = require("firebase/auth");
const { firebaseAuth, retrievePictures } = require('./firebase');


app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/home', async (req, res) => {
    const loginResponse = await monitorAuthState();
    console.log('login ' + loginResponse)
    return res.json(loginResponse);
})
app.get('/pictures', async (req, res) => {
    const querySnapshot = await retrievePictures(userUID);
    return res.json(querySnapshot);
})

app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`);
});

app.post('/login',async (req, res) => {
    console.log('post request');
    const loginResponse = await authenticateLogin(req.body.email, req.body.password)
    console.log('login ' + loginResponse);
    res.json(loginResponse);
})
app.get('/logout',async (req, res) => {
    const loginResponse = await logOut();
    console.log('logout ' + loginResponse);
    res.json(loginResponse);
})


async function authenticateLogin(emailValue, passwordValue) {
    return signInWithEmailAndPassword(firebaseAuth, emailValue, passwordValue)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            userUID = user.uid;
            return true;

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            userUID = null;
            return false;
        });
}

const logOut = async () => {
    return firebaseAuth.signOut().then(() => {
        userUID = null;
        return true;

    }).catch((error) => {
        console.log(error);
        return false;
    });
};

// MODAL SCRIPTS //
// Modal for uploading pictures
const uploadPictureModal = document.querySelector('#upload-picture-modal');
const close = document.querySelector('.close');
const uploadPictureBtn = document.querySelector('#upload-picture-button');
// Opens modal when clicking on the button
uploadPictureBtn.addEventListener('click', () => {
    uploadPictureModal.classList.toggle('hidden');
    console.log('clicked')
});
// Closes modal when clicking on the X
close.addEventListener('click', () => {
    uploadPictureModal.classList.toggle('hidden');
    console.log('clicked')
});
// Closes modal when clicking outside of it
// window.addEventListener('click', (event) => {
//     if (event.target == uploadPictureModal) {
//         uploadPictureModal.classList.toggle('hidden');
//         console.log('closed')
//     }
// });



//
// app.post('/upload', async (req, res) => {
//     console.log('post request');
//     const file = req.body.file;
//     const storageRef = ref(storage, 'pictures/' + file.name);
//     console.log(storageRef);
//     res.json(true);
// });

// Code for uploading pictures
// const pictureFile = document.querySelector('#picture-file');
// pictureFile.addEventListener('change', (event) => {
//     const fileItem = document.querySelector('#picture-file').files[0];
//     const fileName = fileItem.name;
//
//     const storageRef = ref(storage, 'pictures/' + fileName);
//     const uploadTask = uploadBytesResumable(storageRef, fileItem);
//
//     uploadTask.on('state_changed',
//         (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             console.log('Upload is ' + progress + '% done');
//         },
//         (error) => {
//             console.log(error);
//         },
//         () => {
//             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                 console.log('File available at', downloadURL);
//             }).catch((error) => {
//                 console.error('Error getting download URL:', error);
//             });
//         }
//     );
// });

async function monitorAuthState() {
    let signedIn = false;
    await onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            userUID = user.uid;
            signedIn = true;
        } else {
            // User is signed out
            userUID = null;
        }
    });
    return signedIn;
}