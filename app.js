const express = require('express');
const app = express();
const PORT = 5050;
const host = `http://localhost:${PORT}`;
let userUID = null;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', async (req, res) => {
    console.log('hi')
    const loginResponse = await monitorAuthState()
    console.log(loginResponse)
    res.json(loginResponse);
})

app.get('/home', (req, res) => {
    console.log('get request');
    //const loginResponse = await monitorAuthState();
    //console.log(loginResponse);
    //res.json(loginResponse);
})
app.listen(PORT, function () {
    console.log(`Demo project at: ${PORT}!`);
});

app.post('/login',async (req, res) => {
    console.log('post request');
    const loginResponse = await authenticateLogin(req.body.email, req.body.password)
    console.log(loginResponse);
    res.json(loginResponse);
})
app.get('/logout',async (req, res) => {
    console.log('get request');
    const loginResponse = await logOut();
    console.log(loginResponse);
    res.json(loginResponse);
})

// const { books } = require('./public/js/books');
// app.get('/books', books);

const { signInWithEmailAndPassword,onAuthStateChanged } = require("firebase/auth");
const { firebaseAuth } = require('./firebase');

async function authenticateLogin(emailValue, passwordValue) {
    return signInWithEmailAndPassword(firebaseAuth, emailValue, passwordValue)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            userUID = user.uid;
            console.log(userUID);

            return true;

        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
            return false;
        });
}

const logOut = async () => {
    return firebaseAuth.signOut().then(() => {
        console.log('logged out');
        return true;

    }).catch((error) => {
        console.log(error);
        return false;
    });
};

async function fetchHome() {
    await fetch(`${host}/index.html`, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }
    })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })
}

async function monitorAuthState() {
   return onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            userUID = user.uid;
            console.log(userUID);
            return true
        } else {
            // User is signed out
            console.log('user is signed out')
            return false
        }
    });
}




// const { db } = require("../../firebase");
//
// const books = async (req, res) => {
//     const booksRef = db.collection('pictures');
//     try{
//         booksRef.get().then((snapshot) => {
//             const data = snapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             console.log(data);
//             return res.status(201).json(data);
//         })
//     } catch (error) {
//         return res
//             .status(500)
//             .json({ general: "Something went wrong, please try again"});
//     }
// };