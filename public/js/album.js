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
            appendAlbums(album)
        });
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
                    appendAlbums(album)

                });
            });
    }
}
function appendAlbums(album){
    const albumDiv = document.createElement('div');
    albumDiv.setAttribute('class','album-object')
    const albumName = document.createElement('p');
    albumName.textContent = album.album_name;
    albumDiv.appendChild(albumName);
    const albumBtn = document.createElement('button')
    albumBtn.setAttribute('class','changBtn')
    albumBtn.textContent = 'Change Name'
    albumDiv.appendChild(albumBtn)
    albums.appendChild(albumDiv);

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

