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
uploadPictureBtn.addEventListener('click', () => {
    uploadPictureModal.classList.toggle('hidden');
});
uploadBtn.addEventListener('click', uploadPicture);

let filters = {
};
// -------------------------------------------- FILTER EVENT LISTENERS
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
    sessionPictures.forEach(picture => {
        if (!citySelect.innerHTML.includes(picture.city)) {
            const cityOption = document.createElement('option');
            cityOption.value = picture.city;
            cityOption.innerText = picture.city;
            citySelect.appendChild(cityOption);
        }
        if (!countrySelect.innerHTML.includes(picture.country)) {
            const countryOption = document.createElement('option');
            countryOption.value = picture.country;
            countryOption.innerText = picture.country;
            countrySelect.appendChild(countryOption);
        }
        if (!albumSelect.innerHTML.includes(picture.album_id)) {
            const albumOption = document.createElement('option');
            albumOption.value = picture.album_id;
            albumOption.innerText = sessionAlbums.find(album => album.id === picture.album_id).data.album_name;
            albumSelect.appendChild(albumOption);
        }
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