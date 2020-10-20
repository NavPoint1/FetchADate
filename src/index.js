let body
let main
let currentUser
let myCharacters = []
let navBar

document.addEventListener("DOMContentLoaded", () => {
    //global variables 
    body = document.querySelector("body");
    main = document.querySelector("main");
    navBar = document.querySelector("#nav-bar");
    //function 
    renderLoginForm();
});

const renderLoginForm = () => {

    //user login Form
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

    let signUpButton = document.createElement("button")
    signUpButton.innerHTML = "Sign Up"
    signUpButton.id = "sign-up-button"
    signUpButton.className = "menu-button"

    loginForm.id = "login-form"
    main.append(formDiv)
    navBar.append(signUpButton)


    loginForm.addEventListener("submit", handleLogin)

    //sign up button
    signUpButton.addEventListener("click", renderSignUpForm)

}

const handleLogin = (event) => {
    event.preventDefault()
    let userName = document.querySelector("#login-name").value
    let userPassword = document.querySelector("#login-password").value

    //post request to make new user 
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

    //fetch 
    fetch("http://localhost:3000/login", requestPackage)
        .then(resp => resp.json())
        .then(resolveLogin)
}

const resolveLogin = (loggedInUser) => {
    currentUser = loggedInUser
    let logOutButton = document.createElement("button")
    logOutButton.id = "log-out-button"
    logOutButton.className = "menu-button"
    navBar.innerHTML = ""
    navBar.append(logOutButton)
    logOutButton.innerText = "Log Out"
    logOutButton.addEventListener("click", handleLogOut)

    fetchCharacters()
}

const handleLogOut = () => {
    currentUser = null
    main.innerHTML = ""
    navBar.innerHTML = `
    `
    renderLoginForm()
}

const renderSignUpForm = (event) => {
    navBar.innerHTML = ""

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
        .then(resp => resp.json())
        .then(resolveLogin)

}

const fetchCharacters = () => {

    fetch("http://localhost:3000/characters")
        .then(resp => resp.json())
        .then(characters => renderCharacterIndex(characters))
}


const renderCharacterIndex = (characters) => {
    main.innerHTML = ""
    let ul = document.createElement("ul")
    main.append(ul)
    ul.id = "character-list"
    characters.forEach(character => {
        renderCharacterIndexItem(character, ul)
    })
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
    if (!myCharacters.includes(character)) {
        meetCharacter(character)
        firstMeeting = true
    }

    //display character
    let charName = document.createElement("div")
        // charName.innerText = character.name
    let pic = document.createElement("img")
    pic.src = character.picture_url
    pic.addEventListener("mouseover", () => {
        charName.innerText = character.name
    })
    pic.addEventListener("mouseout", () => { charName.innerText = "" })

    //dialogue
    let dialoguePrompt = document.createElement("div")

    let dialogueArray = characterDialogue(character.interest)

    if (firstMeeting) {
        dialoguePrompt.innerText = "Nice to meet you. " + dialogueArray[0]
    } else {
        dialoguePrompt.innerText = dialogueArray[0]
    }
    let i = 1
    while (i < dialogueArray.length - 2) {
        renderDialogueOptions(i, dialogueArray)
        i++
    }
    main.append(charName, pic, dialoguePrompt)
}


const meetCharacter = (character) => {

    // fetch post request to build a relationship
    fetch("http://localhost:3000/relationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                character_id: character.id
            })
        })
        .then(myCharacters.push(character))
}

const characterDialogue = (interest) => {
    switch (interest) {
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
            //code
    }
}

const renderDialogueOptions = (i, dialogueArray) => {
    let div = document.createElement("div")
    div.innerText = dialogueArray[i]
    main.append(div)
    div.addEventListener("click", () => {
        if (i == dialogueArray[5]) {
            correctAnswer()
        } else {
            wrongAnswer()
        }
    })
}

const correctAnswer = () => {

}