const favorites = document.querySelector('#favorite')
const location = document.querySelector('#location')
const year = document.querySelector('#year')
const tag = document.querySelector('#tag')
const id = document.querySelector('#id')
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
                renderPictures(picturesDiv);
            }
        });
}
loadPage();
const picturesDiv = document.querySelector('#pictures-div');


