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

app.post('/login',(req, res) => {
    console.log('post request');
    authenticateLogin(req.body.email, req.body.password)
})

const { books } = require('./handlers/books');
app.get('/books', books);

const { signInWithEmailAndPassword } = require("firebase/auth");
const { firebaseAuth } = require('./util/admin');
async function authenticateLogin(emailValue, passwordValue) {
    await signInWithEmailAndPassword(firebaseAuth, emailValue, passwordValue)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            userUID = user.uid;
            console.log(userUID);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
}