const URL = "http://localhost:3000/"
let body
let main
let currentUser
let myCharacterIds = []
let navBar

document.addEventListener("DOMContentLoaded", () => {
    // global variables 
    initializeGlobals();
    // start game
    renderLoginForm();
});

const initializeGlobals = () => {
    body = document.querySelector("body");
    main = document.querySelector("main");
    navBar = document.querySelector("#nav-bar");
}

//////////////// LOG IN ////////////////

const renderLoginForm = () => {
    // login form
    let formDiv = document.createElement("div")
    formDiv.id = "form-div"
    let loginForm = document.createElement("form")
    formDiv.append(loginForm)
    loginForm.innerHTML =
        `<p class="log-in-title">Sign in</p>
        <!-- <label>User Name</label> -->
        <input placeholder="Username" type="text" id="login-name">
        <br>
        <!-- <label>Password</label> -->
        <input placeholder="Password" type="password" id="login-password">
        <br>
        <button id="login-button">Login</button>`
    loginForm.id = "login-form"
    // sign up button
    let signUpButton = document.createElement("button")
    signUpButton.innerHTML = "Sign Up"
    signUpButton.id = "sign-up-button"
    signUpButton.className = "menu-button"
    // append
    main.append(formDiv)
    navBar.append(signUpButton)
    // event listeners
    loginForm.addEventListener("submit", handleLogin)
    signUpButton.addEventListener("click", renderSignUpForm)

}

const handleLogin = (event) => {
    event.preventDefault()
    let userName = document.querySelector("#login-name").value
    let userPassword = document.querySelector("#login-password").value
    // post request to make new user 
    let requestPackage = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user: {
                name: userName,
                password: userPassword,
            }
        })
    }
    // fetch 
    fetch(URL + "login", requestPackage)
        .then(resp => resp.json())
        .then(resolveLogin)
}

const resolveLogin = (loggedInUser) => {
    // set up globals
    currentUser = loggedInUser
    loggedInUser.characters.forEach(character => myCharacterIds.push(character.id))
    // clear sign in button
    navBar.innerHTML = ""
    // logout button
    let logOutButton = document.createElement("button")
    logOutButton.id = "log-out-button"
    logOutButton.className = "menu-button"
    navBar.append(logOutButton)
    logOutButton.innerText = "Log Out"
    logOutButton.addEventListener("click", handleLogOut)
    // start game
    fetchCharacters()
}

const handleLogOut = () => {
    currentUser = null
    main.innerHTML = ""
    navBar.innerHTML = ""
    renderLoginForm()
}

const renderSignUpForm = (event) => {
    navBar.innerHTML = ""
    // clear login form + build signup form 
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
    // eventListener for submit --> handleSignup 
    let signUpForm = document.querySelector("#sign-up-form")
    signUpForm.addEventListener("submit", handleSignUp)
}

const handleSignUp = (event) => {
    event.preventDefault()
    let userName = document.querySelector("#login-name").value
    let userPassword = document.querySelector("#login-password").value
    let userPicture = document.querySelector("#user-picture").value
    // post request to make new user 
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
    fetch(URL + "users", requestPackage)
        .then(resp => resp.json())
        .then(resolveLogin)
}

//////////////// GAME ////////////////

const fetchCharacters = () => {
    fetch(URL + "characters")
        .then(resp => resp.json())
        .then(characters => renderCharacterIndex(characters))
}

const renderCharacterIndex = (characters) => {
    // clear screen
    main.innerHTML = ""
    // display characters
    let ul = document.createElement("ul")
    main.append(ul)
    ul.id = "character-list"
    characters.forEach(character => {
        renderCharacterIndexItem(character, ul)
    })
    // user show button
    // user show event listener
    
}

const renderCharacterIndexItem = (character, ul) => {
    let li = document.createElement("li")
    ul.append(li)
    li.innerText = character.name
    li.addEventListener("click", () => {
        renderCharacterShow(character)
    })
}

const renderCharacterShow = (character) => {
    // clear screen
    main.innerHTML = ""
    let firstMeeting = false
    // if first time meeting...
    if (!myCharacterIds.includes(character.id)) {
        meetCharacter(character)
        firstMeeting = true
    }
    // display character
    let charName = document.createElement("div")
    let pic = document.createElement("img")
    pic.src = character.picture_url
    pic.addEventListener("mouseover", () => { charName.innerText = character.name })
    pic.addEventListener("mouseout", () => { charName.innerText = "" })
    // dialogue
    let dialoguePrompt = document.createElement("div")
    let dialogueArray = characterDialogue(character.interest)
    if (firstMeeting) {
        dialoguePrompt.innerText = "Nice to meet you. " + dialogueArray[0]
    }
    else {
        dialoguePrompt.innerText = dialogueArray[0]
    }
    main.append(dialoguePrompt)
    let i = 1
    while (i < dialogueArray.length - 1) {
        renderDialogueOptions(i, dialogueArray, character)
        i++
    }
    main.append(pic, charName)
}

const meetCharacter = (character) => {
    // fetch post request to build a relationship
    fetch(URL + "relationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                character_id: character.id
            })
        })
        .then(myCharacterIds.push(character.id))
}

const characterDialogue = (interest) => {
    switch(interest) {
        case "Marine Biology":
            return [
                "Avast ye landlubber!",
                "Tis a beautiful day for sailin",
                "lets go drink",
                "lets go steal",
                "Walk away",
                1
            ]
            break;
        case "Pop Culture":
            return ""
            break;
        case "Zodiac":
            return ""
            break;
        default:
            // code
    }
}

const renderDialogueOptions = (i, dialogueArray, character) => {
    let div = document.createElement("div")
    div.innerText = i + ". " + dialogueArray[i]
    main.append(div)
    div.addEventListener("click", () => {
        if (i == dialogueArray[5]) {
            correctAnswer(character)
        }
        else {
            wrongAnswer(character) // implement a "very wrong answer" that offends the person later?
        }
    })
}

const correctAnswer = (character) => {
    // fetch request to update relationship level
    // display happy goodbye text?
    // render character index?
}

const wrongAnswer = (character) => {
    // display neutral goodbye text?
    // render character index?
}


/////// ideas
// 1) relationship level should be an integer instead of a string so you can gain partial points?
// 2) interests should be a model?