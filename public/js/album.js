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

            // Create a div element to hold album information
            const albumDiv = document.createElement('div');

            // Create a paragraph element for the album name
            const albumName = document.createElement('p');
            albumName.textContent = album.album_name; // Assuming your album object has a 'name' property
            albumDiv.appendChild(albumName);

            // Append the album div to the #recent-album element
            recentAlbums.appendChild(albumDiv);
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
                console.log(albums[0]);
                albums.forEach(album => {
                    console.log(album);
                });
            });
    }
}

