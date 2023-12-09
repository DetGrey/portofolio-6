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

function appendPictures (destinationDiv, pictures) {
    pictures.forEach(picture => {
        console.log(picture);
        const img = document.createElement('img');
        img.src = picture.img_path;
        img.id = picture.img_path;
        img.classList.add('picture');
        destinationDiv.appendChild(img);
    });

    const imgElements = document.querySelectorAll('.picture');

    imgElements.forEach(img => {
        img.addEventListener('click', () => {
            pictures.forEach(picture => {
                if (img.id === picture.img_path) {
                    appendPictureModalContent(picture);
                    pictureModal.classList.remove('hidden');
                }
            });
        });
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
uploadPictureBtn.addEventListener('click', () => {
    uploadPictureModal.classList.toggle('hidden');
});
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