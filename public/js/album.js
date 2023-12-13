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
            console.log(data);
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

const albums = document.querySelector('#albums');
async function renderAlbums () {
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"))
    if (sessionAlbums) {
        console.log('Returning cached albums');
        sessionAlbums.forEach(album => {
            console.log(album);
            appendAlbums(album.data)
        });
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
                console.log(albums);
                albums.forEach(album => {
                    console.log(album);
                    appendAlbums(album.data)
                });
                renderAlbumPictures()
            });
    }
}
function appendAlbums(album) {
    const albumName = document.createElement('h2');
    albumName.setAttribute('class', 'p-album-name');
    albumName.textContent = album.album_name;

    albums.appendChild(albumName);

    console.log(album);
    const albumDiv = document.createElement('div');
    albumDiv.setAttribute('class', 'album-object');

    albums.appendChild(albumDiv);

    const albumBtn = document.createElement('button');
    albumBtn.setAttribute('class', 'changeBtn');
    albumBtn.textContent = 'Change Album Name';

    albums.insertAdjacentElement('beforeend', albumBtn);
}


function renderAlbumPictures () {
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"))
    console.log(sessionPictures)
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"))
    console.log(sessionAlbums)
    const pTagAlbums = document.querySelectorAll('.p-album-name');

    // for each pic check if the album id fits
    sessionPictures.forEach(picture => {
        console.log(picture.album_id)
        const album = sessionAlbums.find(album => album.id === picture.album_id)
        const pTagAlbumsArray = Array.from(pTagAlbums);
        const pTag = pTagAlbumsArray.find(tag => tag.innerText === album.data.album_name)
        console.log(pTag.nextElementSibling.childElementCount)
        if (pTag.nextElementSibling.childElementCount !== 3) { // 3 is max number of img from firebase
            const img = document.createElement('img')
            img.src = picture.img_path
            img.classList.add('picture');
            pTag.nextSibling.appendChild(img)
        }

        // sessionAlbums.forEach(album => {
        //     if (picture.album_id === album.id) {
        //         pTagAlbums.forEach(tag =>{
        //             console.log(tag)
        //
        //             if (tag.parentElement.childElementCount !== 2+3){ //2 Is Default elements and 3 is max number of img from firebase
        //                 if (tag.innerText === album.data.album_name) {
        //                     const img = document.createElement('img')
        //                     img.src = picture.img_path
        //                     tag.insertAdjacentElement('afterend',img)
        //             }
        //             }
        //         })
        //     }
        // })
    })
}



const uploadAlbumModal = document.querySelector('#upload-album-modal');
const uploadAlbumBtn = document.querySelector('#upload-album-button');
uploadAlbumBtn.addEventListener('click', () => {
    uploadAlbumModal.classList.toggle('hidden');
});

close.forEach(close => {
    close.addEventListener('click', () => {
        if (!uploadAlbumModal.classList.contains('hidden')) {
            uploadAlbumModal.classList.toggle('hidden');
        }
    });
});

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
        console.log(albumData)
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
                console.log(data);
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

document.addEventListener('DOMContentLoaded', function () {
    const uploadAlbumModal = document.querySelector('#upload-album-modal');
    const closeButton = uploadAlbumModal.querySelector('.close');

    closeButton.addEventListener('click', function () {
        uploadAlbumModal.classList.toggle('hidden');
    });
});