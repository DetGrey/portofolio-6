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
                clearSessionStorage();
                location.href = `/login.html`;
            }
            else {
                renderPictures(picturesDiv);
                appendLocationSelect();
            }
        });
}
loadPage();
const picturesDiv = document.querySelector('#pictures-div');
let filters = {
};

// -------------------------------------------- FILTER EVENT LISTENERS
const filterElements = document.querySelectorAll('.filter');
filterElements.forEach(filter => {
    filter.addEventListener('change', (event) => {
        const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
        if (filter.value === '') {
            delete filters[filter.id];
            appendPictures(picturesDiv, filterPictures(sessionPictures, filters));
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
            appendPictures(picturesDiv, filterPictures(sessionPictures, filters));
        }
    });
});

function appendLocationSelect() {
    const citySelect = document.querySelector('#filter-city');
    const countrySelect = document.querySelector('#filter-country');
    const sessionPictures = JSON.parse(sessionStorage.getItem("sessionPictures"));
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
    });
}