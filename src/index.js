const URL = "http://localhost:3000/"
let body
let main
let navBar
let currentUser
let myCharacterIds = []
let myRelationshipIds = []
let myGiftIds = []

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
    signUpButton.className = "ui button"
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
    if (loggedInUser.characters) {
        loggedInUser.characters.forEach(character => myCharacterIds.push(character.id))
        loggedInUser.relationships.forEach(relationship => myRelationshipIds.push(relationship.id))
        loggedInUser.gifts.forEach(gift => myGiftIds.push(gift.id))
    }
    // clear sign in button
    navBar.innerHTML = ""
        // logout button
    let logOutButton = document.createElement("button")
    logOutButton.id = "log-out-button"
    logOutButton.className = "ui button"
    navBar.append(logOutButton)
    logOutButton.innerText = "Log Out"
    logOutButton.addEventListener("click", handleLogOut)
        // start game
    fetchCharacters()
}

const handleLogOut = () => {
    currentUser = null
    myCharacterIds = []
    myRelationshipIds = []
    myGiftIds = []
    main.innerHTML = ""
    navBar.innerHTML = ""

    //change background image
    body.className = "logout"
    renderLoginForm()
}

const renderSignUpForm = (event) => {
    navBar.innerHTML = ""
        // clear login form + build signup form 
    main.innerHTML = `<form id="sign-up-form">
        <input placeholder="Username" type="text" id="login-name">
        <br>
        <input placeholder="Password" type="password" id="login-password">
        <br>
        <input placeholder="Picture URL" type="text" id="user-picture">
        <br>
        <button id="sign-up-button" class="ui button">Sign Up</button>
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

//////////////// BEGIN GAME ////////////////

const fetchCharacters = () => {
    fetch(URL + "characters")
        .then(resp => resp.json())
        .then(characters => renderCharacterIndex(characters))
}

const renderCharacterIndex = (characters) => {
    // clear screen
    main.innerHTML = ""

    //character image container
    let imgDiv = document.createElement("div")
    imgDiv.className = "character-img-index-container"
    main.append(imgDiv)
        // display characters
    characters.forEach(character => {
            renderCharacterIndexItem(character, characters.indexOf(character), imgDiv)
        })
        // user show button
        // user show event listener
    let userShowButton = document.createElement("button")
    userShowButton.id = "user-show-button"
    userShowButton.className = "ui button"
    userShowButton.innerText = "🏚"
    navBar.append(userShowButton)
    userShowButton.addEventListener("click", fetchUserShow)

    // change background image 
    body.className = "character-index"
}

const renderCharacterIndexItem = (character, index, imgDiv) => {
    let img = document.createElement("img")
    img.id = "charImg" + index
    img.classList.add("character-image-index")
    imgDiv.append(img)
    img.src = character.picture_url
    img.addEventListener("click", () => {
        renderCharacterShow(character)
    })
}

const renderCharacterShow = (character) => {
    // clear screen
    main.innerHTML = ""
    deleteUserShowButton()
        //change background image
    body.className = "character-show"
        // display character
    let charName = document.createElement("div")
    let pic = document.createElement("img")
    pic.classList.add("character-image-show")
    pic.src = character.picture_url
    pic.addEventListener("mouseover", () => { charName.innerText = character.name })
    pic.addEventListener("mouseout", () => { charName.innerText = "" })
    main.append(pic, charName)

    //first meeting check 
    firstMeetingCheck(character)
}

const firstMeetingCheck = (character) => {
    // if first time meeting...
    //create relationship 
    let firstMeeting = false
    if (!myCharacterIds.includes(character.id)) {
        firstMeeting = true
        createRelationship(character, firstMeeting)
    } else {
        fetchDialogue(character, firstMeeting)
    }
}


const createRelationship = (character, firstMeeting) => {
    // fetch post request to build a relationship
    fetch(URL + "relationships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: currentUser.id,
                character_id: character.id
            })
        })
        .then(response => response.json())
        .then(relationship => {
            myRelationshipIds.push(relationship.id)
            myCharacterIds.push(character.id)
            fetchDialogue(character, firstMeeting)
        })
}

//////////////// DIALOGUE ////////////////

const fetchDialogue = (character, firstMeeting) => {
    let requestPackage = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: currentUser.id
        })
    }

    fetch(URL + "interests/" + character.interest.id, requestPackage)
        .then(resp => resp.json())
        .then(dialogueArray => {
            characterDialogue(dialogueArray, character, firstMeeting)
        })
}

const characterDialogue = (dialogueArray, character, firstMeeting) => {
    // set up divs
    let dialogueContainer = document.createElement("div")
    main.append(dialogueContainer)
    let dialoguePrompt = document.createElement("div")
    dialogueContainer.append(dialoguePrompt)
    dialogueContainer.id = "dialogue-container"
    if (firstMeeting) {
        dialoguePrompt.innerText = "Nice to meet you. " + dialogueArray[0]
    } else {
        dialoguePrompt.innerText = dialogueArray[0]
    }
    dialogueContainer.append(dialoguePrompt)
    let i = 1
    while (i < dialogueArray.length - 1) {
        renderDialogueOptions(i, dialogueArray, character, dialogueContainer)
        i++
    }
    if(!firstMeeting && myGiftIds.length != 0) {
        let giftOption = document.createElement("div")
        giftOption.innerText = "5. Oh! that reminds me... I have something for you..." 
        dialogueContainer.append(giftOption)
        giftOption.addEventListener("click", () => {
            renderOfferGiftMenu(character, dialogueContainer, dialoguePrompt)
        })
    }
}

const renderOfferGiftMenu = (character, dialogueContainer, dialoguePrompt) => {
    dialogueContainer.innerHTML = ""
    dialoguePrompt.innerText = "What have you got for me...?"
    let i = 0
    while (i < currentUser.gifts.length) {
        renderOfferGiftItem(i, currentUser.gifts[i], character, dialogueContainer)
        i++
    }
}

const renderOfferGiftItem = (i, gift, character, dialogueContainer) => {
    i = i + 1
    let div = document.createElement("div")
    div.innerText = i + ". " + gift.name
    dialogueContainer.append(div)
    div.addEventListener("click", () => {
        giveGift(gift, character)
    })
}

const giveGift = (gift, character) => {
    // move to backend to conceal info from player -- but who cares at this point
    let relationshipValue = 1
    let giftResponse = "Oh. Thanks."
    if(character.favorite_gift === gift.name) {
        relationshipValue = gift.favoriteValue
        giftResponse = "What! That's amazing!! Thank you so much!"
    }
    // fetch request to update user inventory + change relationship level
    fetch(URL + "users/" + currentUser.id + "/give", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            gift_id: gift.id, // which gift to remove
            user_id: currentUser.id, // which user to remove from
            character_id: character.id, // use this + user to find relationship to modify
            change: relationshipValue
         })
    })
        .then(res => res.json())
        .then(updatedUser => {
            // update user data
            currentUser = updatedUser
            // remove gift id from tracked gifts
            const index = myGiftIds.indexOf(gift.id);
            if (index > -1) {
                myGiftIds.splice(index, 1);
            }
            // render goodbye text
            goodbyePage(giftResponse)
        })
}


const renderDialogueOptions = (i, dialogueArray, character, dialogueContainer) => {
    let div = document.createElement("div")
    div.innerText = i + ". " + dialogueArray[i]
    dialogueContainer.append(div)
    div.addEventListener("click", () => {
        answer(character, i, dialogueArray.slice(-1)[0])
    })
}

const answer = (character, answerIndex, questionId) => {
    // fetch request to update relationship level
    // patch request to relationship show page 
    // relationship id 
    let relationshipId = myRelationshipIds[myCharacterIds.indexOf(character.id)]

    fetch(URL + "relationships/" + relationshipId, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                response_index: answerIndex,
                question_id: questionId,
                interest_id: character.interest.id
            })
        })
        .then(response => response.json())
        .then(pointValue => {
            // display happy goodbye text/bad goodbye text
            let goodbyeText
            if (pointValue > 0) {
                // happy
                goodbyeText = "Have a great day!"
            } else if (pointValue < 0) {
                // mad
                goodbyeText = "mad"
            } else {
                // neutral
                goodbyeText = "Goodbye"
            }
            // render goodbye text
            goodbyePage(goodbyeText)
        })
}

const goodbyePage = (goodbyeText) => {
    // clear old text
    let dialogueContainer = document.querySelector("#dialogue-container")
    dialogueContainer.innerHTML = ""
        // display goodbye text
    let div = document.createElement("div")
    div.innerText = goodbyeText
    dialogueContainer.append(div)
        // button to leave
    let button = document.createElement("button")
    button.innerText = "Leave"
    main.append(button)
    button.addEventListener("click", fetchCharacters)
}

//////////////// PROFILE ////////////////

const fetchUserShow = () => {
    // clear screen
    main.innerHTML = ""
    deleteUserShowButton()
        // fetch updated current user + their relationships
    fetch(URL + "users/" + currentUser.id)
        .then(response => response.json())
        .then(updatedUser => {
            currentUser = updatedUser
            renderUserShow();
        })
}

const renderUserShow = () => {
    let relationships = currentUser.relationships
    //clear background 
    body.className = "user-show"
    // show user's name and pic (and points and items)
    let myName = document.createElement("div")
    myName.innerText = currentUser.name
    let pic = document.createElement("img")
    pic.src = currentUser.picture_url
    let relationshipsContainer = document.createElement("div")
    main.append(pic, myName, relationshipsContainer)
    // index of relationships - show character + level
    relationships.forEach(relationship => {
            let relationshipDiv = document.createElement("div")
            relationshipsContainer.append(relationshipDiv)
            let charName = currentUser.characters[relationships.indexOf(relationship)].name
            let relationshipLvlText
            if (relationship.level >= -3 && relationship.level < 0) {
                relationshipLvlText = " doesn't listen when you speak."
            } else if (relationship.level >= -10 && relationship.level < -3) {
                relationshipLvlText = " is totally ignoring you."
            } else if (relationship.level >= -20 && relationship.level < -10) {
                relationshipLvlText = " looked disgusted last time you met."
            } else if (relationship.level < -20) {
                relationshipLvlText = " is bitter about what you've done..."
            } else if (relationship.level >= 0 && relationship.level < 3) {
                relationshipLvlText = " seems cool with you."
            } else if (relationship.level >= 3 && relationship.level < 7) {
                relationshipLvlText = " is really friendly."
            } else if (relationship.level >= 7 && relationship.level < 10) {
                relationshipLvlText = " might have been flirting with you?"
            } else if (relationship.level >= 10 && relationship.level < 15) {
                relationshipLvlText = " was definitely flirting with you."
            } else if (relationship.level >= 15 && relationship.level < 30) {
                relationshipLvlText = "crush"
            }
            relationshipDiv.innerText = charName + relationshipLvlText
        })
    // return to character index button: "Meet New People"
    let returnButton = document.createElement("button")
    returnButton.innerText = "Meet New People"
    returnButton.addEventListener("click", fetchCharacters)
    main.append(returnButton)
    // inventory
    let inventoryDiv = document.createElement("div")
    inventoryDiv.id = "inventory-container"
    main.append(inventoryDiv)
    inventoryDiv.innerText = "My Items:"
    currentUser.gifts.forEach(gift => {
        renderInventoryItem(gift, inventoryDiv)
    })
    // points
    let pointsDiv = document.createElement("div")
    pointsDiv.id = "currency-display"
    pointsDiv.innerText = "Social Energy: " + currentUser.points
    main.append(pointsDiv)
    let giftHeader = document.createElement("div")
    giftHeader.id = "gift-header"
    giftHeader.innerText = "Get A Gift!"
    pointsDiv.append(giftHeader)
    fetchGiftsIndex(giftHeader)
}

const renderInventoryItem = (gift, inventoryDiv) => {
    let giftDiv = document.createElement("div")
    inventoryDiv.append(giftDiv)
    giftDiv.innerText = gift.name
}

const fetchGiftsIndex = (giftHeader) => {
    // fetch gifts
    fetch(URL + "gifts/")
        .then(response => response.json())
        .then(gifts => {
            gifts.forEach(gift => {
                renderGiftItem(gift, giftHeader)
            })
        })
}

const renderGiftItem = (gift, giftHeader) => {
    let giftDiv = document.createElement("div")
    giftHeader.append(giftDiv)
    giftDiv.innerText = gift.name
    giftDiv.style.width = "15%"
    let priceDiv = document.createElement('div')
    giftDiv.append(priceDiv)
    priceDiv.style.cssFloat = "right"
    priceDiv.innerText = gift.price + " energy"
    if(myGiftIds.includes(gift.id)) {
        giftDiv.style.color = "gray"
    }
    else if(currentUser.points < gift.price) {
        priceDiv.style.color = "gray"
    }
    else {
        giftDiv.addEventListener("click", () => {
            handleBuyGift(gift, giftHeader)
        })
    }
}

const handleBuyGift = (gift, giftHeader) => {
    // fetch request to add gift to user
    fetch(URL + "users/" + currentUser.id + "/buy", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ gift_id: gift.id })
    })
        .then(res => res.json())
        .then(updatedUser => {
            // update user data
            currentUser = updatedUser
            // track gift
            myGiftIds.push(gift.id)
            // update DOM - inventory
            let inventoryDiv = document.querySelector("#inventory-container")
            renderInventoryItem(gift, inventoryDiv)
            // update DOM - rerender purchase options (less currency, updated inventory)
            giftHeader.innerHTML = ""
            giftHeader.innerText = "Get A Gift!"
            fetchGiftsIndex(giftHeader)
            // update DOM - display correct amount of currency
            let currencyText = document.querySelector("#currency-display").firstChild
            currencyText.nodeValue = "Social Energy: " + currentUser.points
        })
        
}


const deleteUserShowButton = () => {
    let button = document.querySelector("#user-show-button")
    button.remove()
}

/////// ideas
// 1) relationship level should be an integer instead of a string so you can gain partial points?
// 2) interests should be a model? an integer instead of a string so you can gain partial points?
// 2) interests should be a model?