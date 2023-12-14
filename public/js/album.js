// ------------------------------------------------------ LOAD PAGE
async function loadPage () {
    await fetch('/home', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then((response) => {
            return response.json();
        })
        .then(async (data) => {
            if (data !== true) {
                clearSessionStorage();
                location.href = `/login.html`;
            } else {
                const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
                if (!sessionPictures) {
                    await fetch('/pictures', {method: 'GET'})
                        .then(response => response.json())
                        .then((data) => {
                            sessionStorage.setItem("sessionPictures", JSON.stringify(data.pictures))
                            sessionStorage.setItem("sessionCountryData", JSON.stringify(data.countryData))
                        });
                }
                await renderAlbums();
            }
        })
}
loadPage();

const albumsDiv = document.querySelector('#albums');

// ------------------------------------------------------ RENDER/APPEND ALBUMS
async function renderAlbums () {
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"))
    if (sessionAlbums) {
        console.log('Returning cached albums');
        appendAlbums(sessionAlbums);
        renderAlbumPictures()
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
                appendAlbums(albums);
                renderAlbumPictures();
            });
    }
}
function appendAlbums(albums) {
    albums.forEach(album => {
        const hr = document.createElement('hr');
        hr.classList.add('line-hr');
        albumsDiv.appendChild(hr);
        const albumHeader = document.createElement('div')

        const albumName = document.createElement('a');
        // albumName.setAttribute('href', `/pictures.html?album_id=${album.id}`);
        albumName.setAttribute('id', album.id);
        albumName.setAttribute('class', 'p-album-name');
        albumName.textContent = album.data.album_name;

        albumHeader.appendChild(albumName);

        const albumBtn = document.createElement('button');
        albumBtn.setAttribute('class', 'changeBtn');
        albumBtn.id = 'album-btn-' + album.id;
        albumBtn.textContent = 'Rename album';

        albumHeader.appendChild(albumBtn);
        albumsDiv.appendChild(albumHeader);
        // albumsDiv.insertAdjacentElement('beforeend', albumBtn);

        const albumDiv = document.createElement('div');
        albumDiv.setAttribute('class', 'album-object');

        albumsDiv.appendChild(albumDiv);
    });

    const aTags = document.querySelectorAll('.p-album-name');
    aTags.forEach(aTag => {
        aTag.addEventListener('click', fetchFilterPictures);
    });

    const renameAlbumBtns = document.querySelectorAll('button.changeBtn');
    renameAlbumBtns.forEach(btn => {
        btn.addEventListener('click', renameAlbum);
    });
}

// ------------------------------------------------------ RENAME ALBUM
async function renameAlbum(event) {
    const id = event.target.id.split('btn-')[1];
    const newName = prompt('Enter new album name');
    if (!newName) {
        return;
    }

    await fetch('/rename-album', {
        method: 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            album_id: id,
            new_name: newName
        })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data === true) {
                alert('Album renamed');
                clearSessionStorage();
                location.href = `/album.html`;
                loadPage();
            }
            else {
                alert('Something went wrong, please try again');
            }
    })
}

// ------------------------------------------------------ REDIRECT TO ALBUM PICTURES
function fetchFilterPictures(event) {
    location.href = `/pictures.html?album_id=${event.target.id}`;
}

// ------------------------------------------------------ RENDER 3 ALBUM PICTURES
function renderAlbumPictures () {
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"))
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"))
    const pTagAlbums = document.querySelectorAll('.p-album-name');

    // for each pic check if the album id fits
    sessionPictures.forEach(picture => {
        const album = sessionAlbums.find(album => album.id === picture.album_id)
        const pTagAlbumsArray = Array.from(pTagAlbums);
        const pTag = pTagAlbumsArray.find(tag => tag.innerText === album.data.album_name)

        if (pTag.parentElement.nextElementSibling.childElementCount !== 3) { // 3 is max number of img from firebase
            const img = document.createElement('img')
            img.src = picture.img_path
            img.classList.add('picture');
            pTag.parentElement.nextSibling.appendChild(img)
        }
    })
}

// ------------------------------------------------------ UPLOAD ALBUM BUTTON
const uploadAlbumBtn = document.querySelector('#upload-album-button');
uploadAlbumBtn.addEventListener('click', () => {
    uploadAlbumModal.classList.toggle('hidden');
});

// ------------------------------------------------------ UPLOAD ALBUM TO DB
const albumName = document.querySelector('#album-name')

async function uploadAlbumToDb(){
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"));
    const error = await sessionAlbums.find(album => album.data.album_name.toLowerCase() === albumName.value.toLowerCase());
    if (error) {
        alert('Album already Exists')
    }
    else {

        const date = new Date();

        const albumData = {
            album_name: albumName.value,
            date_created: date,
        }

        await fetch('/upload-album-to-db', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(albumData)
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                if (data === true) {
                    alert('Album uploaded');
                    clearSessionStorage();
                    location.href = `/album.html`;
                    loadPage();
                }
                else {
                    alert('Something went wrong, please try again');
                }
            });
    }
}

const submitAlbum = document.querySelector('#submit-album-button');

submitAlbum.addEventListener('click',uploadAlbumToDb)

// ------------------------------------------------------ CLOSE ALBUM MODAL
document.addEventListener('DOMContentLoaded', function () {
    const uploadAlbumModal = document.querySelector('#upload-album-modal');
    const closeButton = uploadAlbumModal.querySelector('.close');

    closeButton.addEventListener('click', function () {
        uploadAlbumModal.classList.toggle('hidden');
    });
});