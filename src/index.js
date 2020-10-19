let body

document.addEventListener("DOMContentLoaded", () => {
    //global variables 
    body = document.querySelector("body");

    //function 
    renderLoginForm();
});

const renderLoginForm = () => {

    //user login Form
    let loginForm = document.createElement("form")
    loginForm.innerHTML =
        `<label>User Name</label>
        <input type="text">
        <br>
        <label>Password</label>
        <input type="password">
        <br>
        <button id="login-button">Login</button>
        <button id="sign-up-button">Sign Up</button>`
    loginForm.id = "login-form"
    body.append(loginForm)

    //login button
    let loginButton = document.querySelector("#login-button")
    loginButton.addEventListener("submit", handleLogin)

    //sign up button
    let signUpButton = document.querySelector("#sign-up-button")
    signUpButton.addEventListener("submit", handleSignUp)

}

const handleLogin = () => {
    //fetch 
    //get request to load a user
}

const handleSignUp = () => {
    //fetch 
    //post request to make new user 
}