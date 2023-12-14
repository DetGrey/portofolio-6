let countryNames;
function clearSessionStorage () {
    sessionStorage.clear();
}

// -------------------------------------------- LOGOUT
const logout = async () => {
    console.log('logout was clicked');

    await fetch('/logout', {method: 'GET'})
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            if (data === true) {
                clearSessionStorage();
                location.href = `/login.html`;
            }
        });
}

const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', logout);

// -------------------------------------------- RENDER PICTURES
async function renderPictures (destinationDiv, filters) {
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
    if (sessionPictures) {
        console.log('Returning cached pictures');
        appendPictures(destinationDiv, filterPictures(sessionPictures, filters));
    }

    else {
        await fetch('/pictures', {method: 'GET'})
            .then(response => response.json())
            .then((data) => {
                sessionStorage.setItem("sessionPictures", JSON.stringify(data.pictures))
                sessionStorage.setItem("sessionCountryData", JSON.stringify(data.countryData))
                appendPictures(destinationDiv, data.pictures);
            });
    }
}

// -------------------------------------------- APPEND COUNTRY DATA
async function appendCountryData () {
    const sessionCountryData = JSON.parse(sessionStorage.getItem("sessionCountryData"));
    console.log(sessionCountryData)
    await renderGeoJSON(sessionCountryData);
}
async function appendAllCountries(){
    fetch('./js/countries.geo.json')
        .then((r) => r.json())
        .then((data) => {
            countryNames = data.features.map((feature) => feature.properties.name).sort();
            const countrySelect = document.querySelector('#country');
            countryNames.forEach(country => {
                countrySelect.innerHTML += '<option value="' + country + '">' + country + '</option>';
            })
        });
}

function appendPictures (destinationDiv, pictures) {
    destinationDiv.innerHTML = '';
    let count = 0;

    pictures.forEach(picture => {
        if (count < 3) {
            const img = document.createElement('img');
            img.src = picture.img_path;
            img.id = picture.img_path;
            img.classList.add('picture');
            destinationDiv.appendChild(img);
        }
    })

    const imgElements = document.querySelectorAll('.picture');

    imgElements.forEach(img => {
        img.addEventListener('click', () => {
            const picture = pictures.find(picture => picture.img_path === img.id);
            appendPictureModalContent(picture);

            pictureModal.classList.remove('hidden');
        });
        count++;
    });
}

function appendPictureModalContent (picture) {
    const dateCreated = new Date(picture.date_created);
    const albumName = JSON.parse(sessionStorage.getItem("sessionAlbums")).find(album => album.id === picture.album_id).data.album_name;

    imgDataDiv.innerHTML = (
        '<h2> ' + picture.img_name + '</h2>'
        + '<img alt="' + picture.alt_text + '" src="' + picture.img_path + '">'
        + '<p>Date created: ' + dateCreated + '</p>'
        + '<p>Album: ' + albumName + '</p>'
        + '<p>City: ' + picture.city + '</p>'
        + '<p>Country: ' + picture.country + '</p>'
        + '<p>Favorite: ' + picture.favorite + '</p>'
        + '<p>Tags: ' + picture.tags.join(" ") + '</p>'
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
        } else if (!uploadAlbumModal.classList.contains('hidden')) {
            uploadAlbumModal.classList.toggle('hidden');
        }
    });
});


// Closes modals when clicking outside of them
window.addEventListener('click', (event) => {
    if (event.target === uploadPictureModal) {
        uploadPictureModal.classList.toggle('hidden');
    }
    // else if (event.target === uploadAlbumModal) {
    //     uploadAlbumModal.classList.toggle('hidden');
    // }
});



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
    const tags = form.get('picture-tags').toLowerCase().split(' ');

    const pictureData = {
        img_name: form.get('picture-name'),
        img_path: url,
        date_created: date,
        album_id: form.get('album-name'),
        city: toTitleCase(form.get('city')),
        country: form.get('country'),
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
                clearSessionStorage();
                location.reload();
                loadPage();
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
            selectAlbum.innerHTML += '<option value="' + album.id + '">' + album.data.album_name + '</option>';
        })
        Array.from(selectAlbum.querySelectorAll('option')).find(option => option.innerText === 'Default').selected = true;
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
                    selectAlbum.innerHTML += '<option value="' + album.id + '">' + album.data.album_name + '</option>';
                });
            });
    }
}

// https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function filterPictures (pictures, filters) {
    console.log(filters);
    return pictures.filter(picture => {
        for (const key in filters) {
            if (key === 'filter-tag') {
                if (!picture.tags.includes(filters[key])) {
                    return false;
                }
            }
            if (key === 'filter-album') {
                if (picture.album_id !== filters[key] && filters[key] !== 'all') {
                    return false;
                }
            }
            if (key === 'filter-country') {
                if (picture.country !== filters[key] && filters[key] !== 'all') {
                    return false;
                }
            }
            if (key === 'filter-city') {
                if (picture.city !== filters[key] && filters[key] !== 'all') {
                    return false;
                }
            }
            if (key === 'filter-yyyy') {
                const year = new Date(picture.date_created).getFullYear();
                if (year !== parseInt(filters[key])) {
                    return false;
                }
            }
            if (key === 'filter-mm') {
                const month = new Date(picture.date_created).getMonth();
                if (month !== parseInt(filters[key])) {
                    return false;
                }
            }
            if (key === 'filter-dd') {
                const day = new Date(picture.date_created).getDate();
                if (day !== parseInt(filters[key])) {
                    return false;
                }
            }
            if (key === 'filter-favorite') {
                if (picture.favorite !== filters[key]) {
                    return false;
                }
            }
        }
        return true;
    })
}
