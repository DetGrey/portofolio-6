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
const recentAlbums = document.querySelector('#recent-album');
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

    // Create a paragraph element for the album name
    const albumName = document.createElement('p');
    albumName.textContent = album.album_name; // Assuming your album object has a 'name' property
    albumDiv.appendChild(albumName);

    // Append the album div to the #recent-album element
    recentAlbums.appendChild(albumDiv);
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