const host = `http://localhost:5050`;

const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-button");
const login = async () => {
    console.log('login was clicked');

    await fetch(host + '/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data === true) {
                location.replace("index.html");
            }
        })
        .catch(function(error) {
            console.log(error);
        });
};
loginBtn.addEventListener("click", login);

const toggleSignUpSection = () => {
    const signUpSection = document.querySelector('#signup-section');
    const loginSection = document.querySelector('#login-section')
    if (signUpSection.classList.contains('hidden')) {
        signUpSection.classList.remove('hidden');
        loginSection.classList.add('hidden');
    }
    else {
        signUpSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    }

}
const showSignUp = document.querySelector('#create-account');
showSignUp.addEventListener('click', toggleSignUpSection)
const showLogin = document.querySelector('#already-have-account');
showLogin.addEventListener('click', toggleSignUpSection)
