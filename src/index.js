let body
let main

document.addEventListener("DOMContentLoaded", () => {
    //global variables 
    body = document.querySelector("body");
    main = document.querySelector("main");

    //function 
    renderLoginForm();
});

const renderLoginForm = () => {

    //user login Form
    let loginForm = document.createElement("form")
    loginForm.innerHTML =
        `<label>User Name</label>
        <input type="text" id="login-name">
        <br>
        <label>Password</label>
        <input type="password" id="login-password">
        <br>
        <button id="login-button">Login</button>`

    let signUpButton = document.createElement("button")
    signUpButton.innerHTML = "Sign Up"
    signUpButton.id = "sign-up-button"

    loginForm.id = "login-form"
    main.append(loginForm, signUpButton)


    loginForm.addEventListener("submit", handleLogin)

    //sign up button
    signUpButton.addEventListener("click", renderSignUpForm)

}

const handleLogin = (event) => {
    event.preventDefault()
    let userName = document.querySelector("#login-name").value
    let userPassword = document.querySelector("#login-password").value

    //fetch 

    //get request to load a user
}


const renderSignUpForm = (event) => {

    //clear login form Signup form 
    main.innerHTML = `<form id="sign-up-form">
        <label>User Name</label>
        <input type="text" id="login-name">
        <br>
        <label>Password</label>
        <input type="password" id="login-password">
        <br>
        <label>Picture URL</label>
        <input type="text" id="user-picture">
        <br>
        <button id="sign-up-button">Sign Up</button>
        </form>`

    //eventListener for submit --> handleSignup 
    let signUpForm = document.querySelector("#sign-up-form")
    signUpForm.addEventListener("submit", handleSignUp)


}

const handleSignUp = (event) => {
    event.preventDefault()

    let userName = document.querySelector("#login-name").value
    let userPassword = document.querySelector("#login-password").value
    let userPicture = document.querySelector("#user-picture").value

    //post request to make new user 
    let requestPackage = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: {
                name: userName,
                password: userPassword,
                picture_url: userPicture
            }
        })
    }
    fetch("http://localhost:3000/users", requestPackage)
        //.then(resp => (resp).json()) //do we need user id? 
        .then(renderCharacterIndex)

}
const renderCharacterIndex = () => {

}