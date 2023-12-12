async function loadPage () {
    await fetch('/home', {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data !== true) {
                sessionStorage.clear();
                location.href = `/login.html`;
            }
            else {
                renderAlbums();
            }
        });
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
function appendAlbums(album){
    console.log(album)
    const albumDiv = document.createElement('div');
    albumDiv.setAttribute('class','album-object')
    const albumName = document.createElement('p');
    albumName.setAttribute('class','p-album-name')
    albumName.textContent = album.album_name;
    albumDiv.appendChild(albumName);
    const albumBtn = document.createElement('button')
    albumBtn.setAttribute('class','changBtn')
    albumBtn.textContent = 'Change Name'
    albumDiv.appendChild(albumBtn)
    albums.appendChild(albumDiv)

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
        sessionAlbums.forEach(album => {
            if (picture.album_id === album.id) {
                pTagAlbums.forEach(tag =>{
                    console.log(tag)
                    if (tag.innerText === album.data.album_name) {
                        const img = document.createElement('img')
                        img.src = picture.img_path
                        tag.insertAdjacentElement('afterend',img)
                    }
                })
            }
        })
    })

    // use if else to check all the different album ids
    // if the pic has the album id, find the right p element with the album name that is connected to the album id
    // add img element after the p element
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

