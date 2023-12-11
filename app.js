const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 5050;
let userUID = null;
const updateUID = (uid) => userUID = uid;

module.exports = { userUID, updateUID };

// Configure multer (for example, using memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { monitorAuthState, retrievePictures, uploadPictureToDB, retrieveAlbums, retrieveCountryData,
    authenticateLogin, createNewUser, logOut, uploadPictureToStorage
} = require('./firebase');


app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/home', async (req, res) => {
    const loginResponse = await monitorAuthState();
    console.log('login ' + loginResponse)
    return res.json(loginResponse);
})
app.get('/pictures', async (req, res) => {
    try {
        console.log('Querying and returning new pictures');
        const queryResult = await retrievePictures(userUID);

        const countryData = await retrieveCountryData(queryResult);
        console.log(countryData)
        return res.json({
            pictures: queryResult,
            countryData: countryData
        });
    } catch (error) {
        console.error('Error retrieving pictures:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/albums', async (req, res) => {
    try {
        console.log('Querying and returning new albums');
        const queryResult = await retrieveAlbums(userUID);
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
    const loginResponse = await authenticateLogin(req.body.email, req.body.password)
    console.log('login ' + loginResponse);
    res.json(loginResponse);
})

app.post('/register', async (req, res) =>{
    const response = await createNewUser(req.body.email,req.body.password,req.body.firstName,req.body.lastName)
    console.log('signup ' + response);
    res.json(response);
})
app.get('/logout',async (req, res) => {
    const loginResponse = await logOut();
    console.log('logout ' + loginResponse);
    res.json(loginResponse);
})

app.post('/upload', upload.single('blob'), async (req, res) => {
    // req.file contains the uploaded file
    const downloadURL = await uploadPictureToStorage(req.file);
    res.json(downloadURL);
});
app.post('/upload-picture-to-db', async (req, res) => {
    const response = await uploadPictureToDB(req.body, userUID)
    console.log('upload to db ' + response);
    res.json(response);
});