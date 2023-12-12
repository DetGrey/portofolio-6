const albumNames = [];

// -------------------------------------------- LOGOUT
const logout = async () => {
    console.log('logout was clicked');

    await fetch('/logout', {method: 'GET'})
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            if (data === true) {
                sessionStorage.clear();
                location.href = `/login.html`;
            }
        });
}

const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', logout);

// -------------------------------------------- RENDER PICTURES
async function renderPictures (destinationDiv) {
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
    const sessionCountryData = JSON.parse(sessionStorage.getItem("sessionCountryData"));
    if (sessionPictures) {
        console.log('Returning cached pictures');
        await appendPictures(destinationDiv, sessionPictures);
    }
    if (sessionCountryData) {
        console.log('Returning cached country data');
        console.log(sessionCountryData)
        await renderGeoJSON(sessionCountryData);
    }

    else {
        await fetch('/pictures', {method: 'GET'})
            .then(response => response.json())
            .then((data) => {
                sessionStorage.setItem("sessionPictures", JSON.stringify(data.pictures))
                sessionStorage.setItem("sessionCountryData", JSON.stringify(data.countryData))
                appendPictures(destinationDiv, data.pictures);
                renderGeoJSON(data.countryData);
            });
    }
}

function appendPictures(destinationDiv, pictures) {
    let count = 0;

    pictures.forEach(picture => {
        if (count < 3) {
            const img = document.createElement('img');
            img.src = picture.img_path;
            img.id = picture.img_path;
            img.classList.add('picture');
            destinationDiv.appendChild(img);

            img.addEventListener('click', () => {
                appendPictureModalContent(picture);
                pictureModal.classList.remove('hidden');
            });

            count++;
        }
    });
}

function appendPictureModalContent (picture) {
    imgDataDiv.innerHTML = (
        '<h2> ' + picture.img_name + '</h2>'
        + '<img alt="' + picture.alt_text + '" src="' + picture.img_path + '">'
        + '<p>Date created: ' + picture.date_created + '</p>'
        + '<p>Album: ' + picture.album_id + '</p>'
        + '<p>City: ' + picture.city + '</p>'
        + '<p>Country: ' + picture.country + '</p>'
        + '<p>Favorite: ' + picture.favorite + '</p>'
        + '<a>Tags: ' + picture.tags.toString() + '</a>'
        + '<p>Alternative text: ' + picture.alt_text + '</p>'
    );
}

const uploadPictureModal = document.querySelector('#upload-picture-modal');
const uploadPictureBtn = document.querySelector('#upload-picture-button');
const pictureModal = document.querySelector('#picture-modal');
const imgDataDiv = document.querySelector('#img-data-div');
const close = document.querySelectorAll('.close');
// Opens modal when clicking on the button

// Closes modal when clicking on the X
close.forEach(close => {
    close.addEventListener('click', () => {
        if (!pictureModal.classList.contains('hidden')) {
            pictureModal.classList.toggle('hidden');
        }
        else if (!uploadPictureModal.classList.contains('hidden')) {
            uploadPictureModal.classList.toggle('hidden');
        }
    });
});


// Closes modal when clicking outside of it
// window.addEventListener('click', (event) => {
//     // if (uploadPictureModal.classList.contains('hidden') === true) {
//     //     // uploadPictureModal.classList.add('hidden');
//     //     console.log(uploadPictureModal.classList.contains('hidden'))
//     // }
//     // else if (event.target !== pictureModal && pictureModal.classList.contains('hidden') === false) {
//     //     pictureModal.classList.toggle('hidden');
//     //     console.log('closed')
//     // }
// });

// -------------------------------------------- UPLOAD PICTURE
const pictureFile = document.querySelector('#picture-file');

const uploadBtn = document.querySelector('#upload-button');


async function uploadPicture () {
    const formData = new FormData()
    formData.append('blob', pictureFile.files[0])
    await fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then((response) => {
            return response.json();
        })
        .then((url) => {
            console.log(url);
            uploadPictureToDB(url);
        });
}

async function uploadPictureToDB(url) {
    const form = new FormData(document.querySelector('#upload-picture-form'));
    console.log(form)

    const date = new Date();
    let favorite = false;
    if (form.get('favorite') === 'on') {
        favorite = true;
    }
    const tags = form.get('picture-tags').replaceAll(' ', '').split(',');

    const pictureData = {
        img_name: form.get('picture-name'),
        img_path: url,
        date_created: date,
        album_id: form.get('album-name'),
        city: toTitleCase(form.get('city')),
        country: toTitleCase(form.get('country')),
        favorite: favorite,
        tags: tags,
        alt_text: form.get('alt-text')
    }

    await fetch('/upload-picture-to-db', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pictureData)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data === true) {
                alert('Picture uploaded');
                sessionStorage.removeItem("sessionPictures");
                location.reload();
            }
            else {
                alert('Something went wrong, please try again');
            }
        });
}
async function renderAlbums() {
    const selectAlbum = document.querySelector('#select-album-name');
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"))
    if (sessionAlbums) {
        console.log('Returning cached albums');
        sessionAlbums.forEach(album => {
            albumNames.push({
                name: album.data.album_name,
                id: album.id
            });
            selectAlbum.innerHTML += '<option value="' + album.id + '">' + album.data.album_name + '</option>';
        })
    }
    else {
        await fetch('/albums', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((albums) => {
                sessionStorage.setItem("sessionAlbums", JSON.stringify(albums))
                albums.forEach(album => {
                    albumNames.push({
                        name: album.data.album_name,
                        id: album.id
                    });
                    selectAlbum.innerHTML += '<option value="' + album.id + '">' + album.data.album_name + '</option>';
                });
            });
    }
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}