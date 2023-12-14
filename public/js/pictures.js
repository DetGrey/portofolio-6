// ------------------------------------------------------ LOAD PAGE
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
            if (data !== true) {
                clearSessionStorage();
                location.href = `/login.html`;
            }
            else {
                let selectedElements = {
                    album: null,
                    city: null,
                    country: null
                };
                if (location.href.includes('city=')) {
                    const selected = location.href.split('city=')[1].split('&')[0];
                    filters['filter-city'] = toTitleCase(selected);
                    selectedElements.city = toTitleCase(selected);
                }
                if (location.href.includes('country=')) {
                    const selected = location.href.split('country=')[1].split('&')[0];
                    filters['filter-country'] = toTitleCase(selected);
                    selectedElements.country = toTitleCase(selected);
                }
                if (location.href.includes('album_id=')) {
                    const selected = location.href.split('album_id=')[1].split('&')[0];
                    filters['filter-album'] = selected;
                    selectedElements.album = selected;
                }

                renderPictures(picturesDiv, filters);
                renderAlbums();
                appendAllCountries();
                appendFilterSelectOptions(selectedElements);
            }
        });
}
loadPage();

const picturesDiv = document.querySelector('#pictures-div');

// ------------------------------------------------------ UPLOAD PICTURE MODAL
uploadPictureBtn.addEventListener('click', () => {
    uploadPictureModal.classList.toggle('hidden');
});
uploadBtn.addEventListener('click', uploadPicture);

// -------------------------------------------- FILTER EVENT LISTENERS
let filters = {};

const filterElements = document.querySelectorAll('.filter');
filterElements.forEach(filter => {
    filter.addEventListener('change', () => {
        const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
        if (filter.value === '') {
            delete filters[filter.id];
        }
        else {
            if (filter.id === 'filter-favorite' && filter.checked) {
                filters[filter.id] = true;
            }
            else if (filter.id === 'filter-favorite' && !filter.checked) {
                delete filters[filter.id];
            }
            else if (filter.id === 'filter-tag') {
                filters[filter.id] = filter.value;
            }
            else {
                filters[filter.id] = filter.value;
            }
        }
        appendPictures(picturesDiv, filterPictures(sessionPictures, filters));
    });
});

function appendFilterSelectOptions(selected) {
    console.log(selected)
    const citySelect = document.querySelector('#filter-city');
    const countrySelect = document.querySelector('#filter-country');
    const albumSelect = document.querySelector('#filter-album');
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
    const sessionAlbums = JSON.parse(sessionStorage.getItem("sessionAlbums"));

    const cities = [];
    const countries = [];
    const albums = [];

    sessionPictures.forEach(picture => {
        if (!cities.includes(picture.city)) {
            cities.push(picture.city);
        }
        if (!countries.includes(picture.country)) {
            countries.push(picture.country);
        }
        if (!albums.includes(picture.album_id)) {
            albums.push(picture.album_id);
        }
    });

    cities.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1)
        .forEach(city => {
        const cityOption = document.createElement('option');
        cityOption.value = city;
        cityOption.innerText = city;
        citySelect.appendChild(cityOption);
    });
    countries.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1)
        .forEach(country => {
        const countryOption = document.createElement('option');
        countryOption.value = country;
        countryOption.innerText = country;
        countrySelect.appendChild(countryOption);
    });
    const albumNames = [];
    albums.forEach(albumID => {
        albumNames.push({
            id: albumID,
            name: sessionAlbums.find(x => x.id === albumID).data.album_name
        });
    });
    albumNames.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
        .forEach(album => {
        const albumOption = document.createElement('option');
        albumOption.value = album.id;
        albumOption.innerText = album.name;
        albumSelect.appendChild(albumOption);
    });

    if (selected.city) {
        citySelect.querySelector(`option[value="${selected.city}"]`).selected = true;
    }
    if (selected.country) {
        countrySelect.querySelector(`option[value="${selected.country}"]`).selected = true;
    }
    if (selected.album) {
        albumSelect.querySelector(`option[value="${selected.album}"]`).selected = true;
    }
}