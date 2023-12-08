const express = require('express');
const app = express();
const PORT = 5050;
let userUID = null;

const { signInWithEmailAndPassword,onAuthStateChanged,createUserWithEmailAndPassword } = require("firebase/auth");
const { firebaseAuth, retrievePictures,createUserInDB,pictures, uploadPictureToDB,retrieveAlbums,albums } = require('./firebase');


app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/home', async (req, res) => {
    const loginResponse = await monitorAuthState();
    console.log('login ' + loginResponse)
    return res.json(loginResponse);
})
app.get('/pictures', async (req, res) => {
    try {
        const queryResult = await retrievePictures(userUID);
        console.log('Querying and returning new pictures');

        return res.json(queryResult);
    } catch (error) {
        console.error('Error retrieving pictures:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/albums', async (req, res) => {
    try {
        const queryResult = await retrieveAlbums(userUID);
        if (queryResult === albums) {
            console.log('Returning cached albums');
        } else {
            console.log('Querying and returning new albums');
        }
        return res.json(queryResult);
    } catch (error) {
        console.error('Error retrieving albums:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`);
});

app.post('/login',async (req, res) => {
    console.log('post request');
    const loginResponse = await authenticateLogin(req.body.email, req.body.password)
    console.log('login ' + loginResponse);
    res.json(loginResponse);
})

app.post('/register', async (req, res) =>{
    console.log('post request');
    const response = await createNewUser(req.body.email,req.body.password,req.body.firstName,req.body.lastName)
    console.log('signup ' + response);
    res.json(response);
})
app.get('/logout',async (req, res) => {
    const loginResponse = await logOut();
    console.log('logout ' + loginResponse);
    res.json(loginResponse);
})

app.post('/upload', async (req, res) => {
    console.log('upload request');
    const uploadResponse = await uploadPictureToDB(req.body.fileItem, req.body.fileName);
    console.log(uploadResponse);
    // res.json(uploadResponse);
});
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


const logOut = async () => {
    return firebaseAuth.signOut().then(() => {
        userUID = null;
        return true;

    }).catch((error) => {
        console.log(error);
        return false;
    });
};




};

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

