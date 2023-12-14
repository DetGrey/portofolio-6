// ------------------------------------------------------ LOGIN
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-button");
const login = async () => {
    console.log('login was clicked');

    await fetch('/login', {
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
                location.href = `/index.html`;
            }
        })
        .catch(function(error) {
            console.log(error);
        });
};
loginBtn.addEventListener("click", login);

const passwordEnter = (event) => {
    if (event.key === "Enter") {
        login();
    }
};

loginPassword.addEventListener("keypress", passwordEnter);


// ------------------------------------------------------ TOGGLE SIGN UP & LOGIN SECTION
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

// ------------------------------------------------------ CREATE ACCOUNT
const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const signupEmail = document.querySelector("#signup-email");

const signupPassword = document.querySelector("#signup-password");
const signupPasswordCheck = document.querySelector("#signup-password-check");

const signupBtn = document.querySelector("#signup-button");

const createAccount = async () => {
    console.log('create was clicked')

    if (signupPassword.value !== signupPasswordCheck.value) {
        alert('Passwords do not match');
        return;
    }

    await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: signupEmail.value,
            password: signupPassword.value,
            firstName: firstName.value,
            lastName: lastName.value
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            if (data === true) {
                location.href = `/index.html`;
            }
        })
        .catch(function(error) {
            console.log(error);
            alert('An error occurred during registration');
        });
}

signupBtn.addEventListener("click", createAccount);

