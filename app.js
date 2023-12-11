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
    authenticateLogin, createNewUser, logOut } = require('./firebase');


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
/*
app.post('/upload', async (req, res) => {
    console.log('upload request');
    console.log(req.file)
    const file = req.body;
    // console.log(file);
    // const uploadResponse = await uploadPictureToDB(req.body.fileItem, req.body.fileItem.name);
    // console.log(uploadResponse);
    // res.json(uploadResponse);
});

 */
app.post('/upload', upload.single('blob'),async (req, res) => {
    // req.file contains the uploaded file
    console.log(req.file);
    const downloadURL = await uploadPictureToStorage(req.file);
    console.log(downloadURL);
    const uploadResponse = await uploadPictureToDB(downloadURL);
    // res.json(uploadResponse);
    // Process the file or perform any desired operation

    res.send('File uploaded successfully.');
});