const express = require('express');
const app = express();
const PORT = 5050;
const host = `http://localhost:${PORT}`;
let userUID = null;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
})
app.get('/index.html', (req, res) => {

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

// const { books } = require('./public/js/books');
// app.get('/books', books);

const { signInWithEmailAndPassword } = require("firebase/auth");
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
    await firebaseAuth.signOut().then(() => {

    }).catch((error) => {
        console.log(error);
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