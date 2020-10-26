"use strict";

var URL = "http://localhost:3000/";
var body;
var main;
var navBar;
var currentUser;
var myCharacterIds;
var myRelationshipIds;
var myGiftIds;
document.addEventListener("DOMContentLoaded", function () {
  // global variables 
  initializeGlobals(); // start game

  renderLoginForm();
});

var initializeGlobals = function initializeGlobals() {
  body = document.querySelector("body");
  main = document.querySelector("main");
  navBar = document.querySelector("#nav-bar");
  currentUser = {};
  myCharacterIds = [];
  myRelationshipIds = [];
  myGiftIds = [];
}; //////////////// LOG IN ////////////////


var renderLoginForm = function renderLoginForm() {
  //ogin background
  body.className = "login-page"; // login form

  var formDiv = document.createElement("div");
  formDiv.id = "form-div";
  var loginForm = document.createElement("form");
  formDiv.append(loginForm);
  loginForm.innerHTML = "<img id= title src= \"https://i.imgur.com/GDUa6Z2.png\">\n        <p class=\"log-in-title\">Sign in</p>\n        <!-- <label>User Name</label> -->\n        <input placeholder=\"Username\" type=\"text\" id=\"login-name\">\n        <br>\n        <!-- <label>Password</label> -->\n        <input placeholder=\"Password\" type=\"password\" id=\"login-password\">\n        <br>\n        <button id=\"login-button\">Login</button>";
  loginForm.id = "login-form"; // sign up button

  var signUpButton = document.createElement("button");
  signUpButton.innerHTML = "Sign Up";
  signUpButton.id = "sign-up-button";
  signUpButton.className = "ui button"; // append

  main.append(formDiv);
  navBar.append(signUpButton); // event listeners

  loginForm.addEventListener("submit", handleLogin);
  signUpButton.addEventListener("click", renderSignUpForm);
};

var handleLogin = function handleLogin(event) {
  event.preventDefault();
  var userName = document.querySelector("#login-name").value;
  var userPassword = document.querySelector("#login-password").value; // post request to make new user 

  var requestPackage = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        name: userName,
        password: userPassword
      }
    })
  }; // fetch 

  fetch(URL + "login", requestPackage).then(function (resp) {
    return resp.json();
  }).then(resolveLogin);
};

var resolveLogin = function resolveLogin(loggedInUser) {
  // set up globals
  currentUser = loggedInUser;

  if (loggedInUser.characters) {
    loggedInUser.characters.forEach(function (character) {
      return myCharacterIds.push(character.id);
    });
    loggedInUser.relationships.forEach(function (relationship) {
      return myRelationshipIds.push(relationship.id);
    });
    loggedInUser.gifts.forEach(function (gift) {
      return myGiftIds.push(gift.id);
    });
  } // clear sign in button


  navBar.innerHTML = ""; // logout button

  var logOutButton = document.createElement("button");
  logOutButton.id = "log-out-button";
  logOutButton.className = "ui button";
  navBar.append(logOutButton);
  logOutButton.innerText = "Log Out";
  logOutButton.addEventListener("click", handleLogOut); // start game

  fetchCharacters();
};

var handleLogOut = function handleLogOut() {
  currentUser = null;
  myCharacterIds = [];
  myRelationshipIds = [];
  myGiftIds = [];
  main.innerHTML = "";
  navBar.innerHTML = ""; //change background image

  body.className = "logout";
  renderLoginForm();
};

var renderSignUpForm = function renderSignUpForm(event) {
  navBar.innerHTML = ""; // clear login form + build signup form 

  main.innerHTML = "<div class=\"sign-up-form\"><form id=\"sign-up-form\">\n        <input placeholder=\"Username\" type=\"text\" id=\"login-name\">\n        <br>\n        <input placeholder=\"Password\" type=\"password\" id=\"login-password\">\n        <br>\n        <input placeholder=\"Picture URL\" type=\"text\" id=\"user-picture\">\n        <br>\n        <button id=\"sign-up-button\" class=\"ui button\">Sign Up</button>\n        </form></div>"; // eventListener for submit --> handleSignup 

  var signUpForm = document.querySelector("#sign-up-form");
  signUpForm.addEventListener("submit", handleSignUp);
};

var handleSignUp = function handleSignUp(event) {
  event.preventDefault();
  var userName = document.querySelector("#login-name").value;
  var userPassword = document.querySelector("#login-password").value;
  var userPicture = document.querySelector("#user-picture").value; // post request to make new user 

  var requestPackage = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: {
        name: userName,
        password: userPassword,
        picture_url: userPicture
      }
    })
  };
  fetch(URL + "users", requestPackage).then(function (resp) {
    return resp.json();
  }).then(resolveLogin);
}; //////////////// BEGIN GAME ////////////////


var fetchCharacters = function fetchCharacters() {
  fetch(URL + "characters").then(function (resp) {
    return resp.json();
  }).then(function (characters) {
    return renderCharacterIndex(characters);
  });
};

var renderCharacterIndex = function renderCharacterIndex(characters) {
  // clear screen
  main.innerHTML = ""; //character image container

  var imgDiv = document.createElement("div");
  imgDiv.className = "character-img-index-container";
  main.append(imgDiv); // display characters

  characters.forEach(function (character) {
    renderCharacterIndexItem(character, characters.indexOf(character), imgDiv);
  }); // user show button
  // user show event listener

  var userShowButton = document.createElement("button");
  userShowButton.id = "user-show-button";
  userShowButton.className = "ui button";
  userShowButton.innerHTML = "<img class= \"user-button-pic\" src =\"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/openmoji/252/house-with-garden_1f3e1.png\"> ";
  navBar.append(userShowButton);
  userShowButton.addEventListener("click", fetchUserShow); // change background image 

  body.className = "character-index";
};

var renderCharacterIndexItem = function renderCharacterIndexItem(character, index, imgDiv) {
  var charName = document.createElement("div");
  charName.id = "hover-char-name";
  charName.style.visibility = "hidden";
  var img = document.createElement("img");
  img.id = "charImg" + index;
  img.classList.add("character-image-index");
  imgDiv.append(img, charName);
  img.src = character.picture_url;
  img.addEventListener("mouseover", function () {
    charName.style.visibility = "visible";
    charName.innerText = "Join " + character.name + " at the Java Café!";
  }); //

  img.addEventListener("mouseout", function () {
    charName.style.visibility = "hidden";
  });
  img.addEventListener("click", function () {
    renderCharacterShow(character);
  });
};

var renderCharacterShow = function renderCharacterShow(character) {
  // clear screen
  main.innerHTML = "";
  deleteUserShowButton(); //change background image

  body.className = "character-show"; // display character

  var charName = document.createElement("div");
  var pic = document.createElement("img");
  pic.classList.add("character-image-show");
  pic.src = character.picture_url;
  pic.addEventListener("mouseover", function () {
    charName.innerText = character.name;
  });
  pic.addEventListener("mouseout", function () {
    charName.innerText = "";
  });
  main.append(pic, charName); //first meeting check 

  firstMeetingCheck(character);
};

var firstMeetingCheck = function firstMeetingCheck(character) {
  // if first time meeting...
  //create relationship 
  var firstMeeting = false;

  if (!myCharacterIds.includes(character.id)) {
    firstMeeting = true;
    createRelationship(character, firstMeeting);
  } else {
    fetchDialogue(character, firstMeeting);
  }
};

var createRelationship = function createRelationship(character, firstMeeting) {
  // fetch post request to build a relationship
  fetch(URL + "relationships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: currentUser.id,
      character_id: character.id
    })
  }).then(function (response) {
    return response.json();
  }).then(function (relationship) {
    myRelationshipIds.push(relationship.id);
    myCharacterIds.push(character.id);
    fetchDialogue(character, firstMeeting);
  });
}; //////////////// DIALOGUE ////////////////


var fetchDialogue = function fetchDialogue(character, firstMeeting) {
  var requestPackage = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: currentUser.id
    })
  };
  fetch(URL + "interests/" + character.interest.id, requestPackage).then(function (resp) {
    return resp.json();
  }).then(function (dialogueArray) {
    characterDialogue(dialogueArray, character, firstMeeting);
  });
};

var characterDialogue = function characterDialogue(dialogueArray, character, firstMeeting) {
  // set up divs
  var dialogueContainer = document.createElement("div");
  dialogueContainer.id = "dialogue-container";
  main.append(dialogueContainer);
  var dialoguePrompt = document.createElement("div");
  dialogueContainer.append(dialoguePrompt);

  if (firstMeeting) {
    dialoguePrompt.innerHTML = "I'm ".concat(character.name, ". Nice to meet you.<br />") + dialogueArray[0];
  } else {
    dialoguePrompt.innerText = dialogueArray[0];
  }

  dialoguePrompt.id = "dialogue-prompt";
  dialogueContainer.append(dialoguePrompt);
  var i = 1;

  while (i < dialogueArray.length - 1) {
    renderDialogueOptions(i, dialogueArray, character, dialogueContainer);
    i++;
  }

  if (!firstMeeting && myGiftIds.length != 0) {
    var giftOption = document.createElement("div");
    giftOption.id = "give-gift-option";
    giftOption.innerText = "🎁 Oh! that reminds me... I have something for you...";
    dialogueContainer.append(giftOption);
    giftOption.addEventListener("click", function () {
      renderOfferGiftMenu(character, dialogueContainer);
    });
  }
};

var renderOfferGiftMenu = function renderOfferGiftMenu(character, dialogueContainer) {
  dialogueContainer.innerHTML = "";
  var dialoguePrompt = document.createElement("div");
  dialogueContainer.append(dialoguePrompt);
  dialoguePrompt.id = "dialogue-prompt";
  dialoguePrompt.innerText = "What have you got for me...?";
  var i = 0;

  while (i < currentUser.gifts.length) {
    renderOfferGiftItem(i, currentUser.gifts[i], character, dialogueContainer);
    i++;
  }
};

var renderOfferGiftItem = function renderOfferGiftItem(i, gift, character, dialogueContainer) {
  i++;
  var giftOfferOptions = document.createElement("div");
  giftOfferOptions.id = "gift-offer-options";
  giftOfferOptions.innerText = i + ". " + gift.name;
  dialogueContainer.append(giftOfferOptions);
  giftOfferOptions.addEventListener("click", function () {
    giveGift(gift, character);
  });
};

var giveGift = function giveGift(gift, character) {
  // move to backend to conceal info from player -- but who cares at this point
  var relationshipValue = 1;
  var giftResponse = "Oh. Thanks.";

  if (character.interest.favorite_gift === gift.name) {
    relationshipValue = gift.favoriteValue;
    giftResponse = "What! That's amazing!! Thank you so much!";
  } // fetch request to update user inventory + change relationship level


  fetch(URL + "users/" + currentUser.id + "/give", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gift_id: gift.id,
      // which gift to remove
      user_id: currentUser.id,
      // which user to remove from
      character_id: character.id,
      // use this + user to find relationship to modify
      change: relationshipValue
    })
  }).then(function (res) {
    return res.json();
  }).then(function (updatedUser) {
    // update user data
    currentUser = updatedUser; // remove gift id from tracked gifts

    var index = myGiftIds.indexOf(gift.id);

    if (index > -1) {
      myGiftIds.splice(index, 1);
    } // render goodbye text


    goodbyePage(giftResponse);
  });
};

var renderDialogueOptions = function renderDialogueOptions(i, dialogueArray, character, dialogueContainer) {
  var dialogueOptions = document.createElement("div");
  dialogueOptions.innerText = i + ". " + dialogueArray[i];
  dialogueOptions.id = "dialogue-options";
  dialogueContainer.append(dialogueOptions);
  dialogueOptions.addEventListener("click", function () {
    answer(character, i, dialogueArray.slice(-1)[0]);
  });
};

var answer = function answer(character, answerIndex, questionId) {
  // fetch request to update relationship level
  // patch request to relationship show page 
  // relationship id 
  var relationshipId = myRelationshipIds[myCharacterIds.indexOf(character.id)];
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
  }).then(function (response) {
    return response.json();
  }).then(function (pointValue) {
    // display happy goodbye text/bad goodbye text
    var goodbyeHappy = ["😊 Have a great day!", "Bye ".concat(currentUser.name), "See you tomorrow ".concat(currentUser.name, "!")];
    var goodbyeNeutral = ["Goodbye 👋", "Bye.", "See you later.", "Have a good one.", "See ya."];
    var goodbyeMad = ["What?", "Uh okay.", "Yeah bye.", "Ight Imma head out.", "K bye 😠"];
    var goodbyeText;

    if (pointValue > 0) {
      // happy
      goodbyeText = goodbyeHappy[Math.floor(Math.random() * goodbyeHappy.length)];
    } else if (pointValue < 0) {
      // mad
      goodbyeText = goodbyeMad[Math.floor(Math.random() * goodbyeMad.length)];
    } else {
      // neutral
      goodbyeText = goodbyeNeutral[Math.floor(Math.random() * goodbyeNeutral.length)];
    } // render goodbye text


    goodbyePage(goodbyeText);
  });
};

var goodbyePage = function goodbyePage(goodbyeText) {
  // clear old text
  var dialogueContainer = document.querySelector("#dialogue-container");
  dialogueContainer.innerHTML = ""; // display goodbye text

  var goodbyeTextdiv = document.createElement("div");
  goodbyeTextdiv.innerText = goodbyeText;
  goodbyeTextdiv.id = "goodbye-text-div";
  dialogueContainer.append(goodbyeTextdiv); // button to leave

  var buttonLeave = document.createElement("button");
  buttonLeave.innerText = "Leave";
  buttonLeave.id = "button-leave";
  main.append(buttonLeave);
  buttonLeave.addEventListener("click", fetchCharacters);
}; //////////////// PROFILE ////////////////


var fetchUserShow = function fetchUserShow() {
  // clear screen
  main.innerHTML = "";
  deleteUserShowButton(); // fetch updated current user + their relationships

  fetch(URL + "users/" + currentUser.id).then(function (response) {
    return response.json();
  }).then(function (updatedUser) {
    currentUser = updatedUser;
    renderUserShow();
  });
};

var renderUserShow = function renderUserShow() {
  var relationships = currentUser.relationships; //clear background 

  body.className = "user-show"; // show user's name and pic (and points and items)

  var myName = document.createElement("div"); //myName.innerText = currentUser.name

  var pic = document.createElement("img");
  pic.src = currentUser.picture_url;
  pic.className = "user-show-picture";
  var relationshipsContainer = document.createElement("div");
  relationshipsContainer.id = "relationships-container"; // relationships title 

  var relationshipsTitleDiv = document.createElement("div");
  relationshipsTitleDiv.id = "relationships-title-div";
  var relationshipsTitle = document.createElement("h3");
  relationshipsTitle.innerText = currentUser.name.toUpperCase() + "'S RELATIONSHIPS STATS";
  relationshipsTitleDiv.append(relationshipsTitle);
  main.append(pic, myName, relationshipsContainer, relationshipsTitleDiv); // index of relationships - show character + level

  relationships.forEach(function (relationship) {
    var relationshipDiv = document.createElement("div");
    var relationshipPicDiv = document.createElement("div");
    var relationshipPic = document.createElement("img");
    relationshipPic.id = "relationship-pic";
    relationshipPicDiv.id = "relationship-pic-div";
    relationshipsContainer.append(relationshipDiv, relationshipPicDiv);
    var charName = currentUser.characters[relationships.indexOf(relationship)].name;
    var charPic = currentUser.characters[relationships.indexOf(relationship)].picture_url;
    var relationshipLvlText;

    if (relationship.level >= -3 && relationship.level < 0) {
      relationshipLvlText = " doesn't listen when you speak.";
    } else if (relationship.level >= -10 && relationship.level < -3) {
      relationshipLvlText = " is totally ignoring you.";
    } else if (relationship.level >= -20 && relationship.level < -10) {
      relationshipLvlText = " looked disgusted last time you met.";
    } else if (relationship.level < -20) {
      relationshipLvlText = " is bitter about what you've done...";
    } else if (relationship.level >= 0 && relationship.level < 3) {
      relationshipLvlText = " seems cool with you.";
    } else if (relationship.level >= 3 && relationship.level < 7) {
      relationshipLvlText = " is really friendly.";
    } else if (relationship.level >= 7 && relationship.level < 10) {
      relationshipLvlText = " might have been flirting with you?";
    } else if (relationship.level >= 10 && relationship.level < 15) {
      relationshipLvlText = " was definitely flirting with you.";
    } else if (relationship.level >= 15 && relationship.level < 22) {
      relationshipLvlText = "'s crush on you is obvious to everyone.";
    } else if (relationship.level >= 22 && relationship.level < 30) {
      relationshipLvlText = " adores you.";
    } else if (relationship.level >= 30) {
      relationshipLvlText = " is madly in love with you.";
    }

    relationshipDiv.innerText = charName + relationshipLvlText;
    relationshipPicDiv.append(relationshipPic);
    relationshipPic.src = charPic;
    relationshipDiv.id = "relationship-div";
    relationshipPicDiv.id = "relationship-pic";
  }); // return to character index button: "Meet New People"

  var returnButton = document.createElement("button");
  returnButton.innerText = "Meet New People";
  returnButton.id = "meet-new-peopole";
  returnButton.className = "ui button";
  returnButton.addEventListener("click", fetchCharacters);
  main.append(returnButton); // inventory

  var inventoryDiv = document.createElement("div");
  inventoryDiv.id = "inventory-container";
  main.append(inventoryDiv);
  inventoryDiv.innerHTML = "<div id=gift-title>🎁 My Gifts:</div>";
  currentUser.gifts.forEach(function (gift) {
    renderInventoryItem(gift, inventoryDiv);
  }); // points

  var pointsDiv = document.createElement("div");
  pointsDiv.id = "currency-display";
  pointsDiv.innerText = "Social Energy: " + currentUser.points + " 💕";
  main.append(pointsDiv);
  var giftHeader = document.createElement("div");
  giftHeader.id = "gift-header";
  giftHeader.innerText = "Buy A Gift!";
  pointsDiv.append(giftHeader);
  fetchGiftsIndex(giftHeader);
};

var renderInventoryItem = function renderInventoryItem(gift, inventoryDiv) {
  var giftDiv = document.createElement("img");
  inventoryDiv.append(giftDiv);
  giftDiv.id = "gift_div"; // giftDiv.innerText = gift.name

  giftDiv.src = gift.picture_url;
};

var fetchGiftsIndex = function fetchGiftsIndex(giftHeader) {
  // fetch gifts
  fetch(URL + "gifts/").then(function (response) {
    return response.json();
  }).then(function (gifts) {
    gifts.forEach(function (gift) {
      renderGiftItem(gift, giftHeader);
    });
  });
};

var renderGiftItem = function renderGiftItem(gift, giftHeader) {
  var giftDiv = document.createElement("div");
  giftHeader.append(giftDiv);
  giftDiv.innerText = gift.name;
  giftDiv.style.width = "90%";
  var priceDiv = document.createElement('div');
  giftDiv.append(priceDiv);
  priceDiv.style.cssFloat = "right";
  priceDiv.innerText = gift.price + " energy";

  if (myGiftIds.includes(gift.id)) {
    giftDiv.style.color = "gray";
  } else if (currentUser.points < gift.price) {
    priceDiv.style.color = "gray";
  } else {
    giftDiv.addEventListener("click", function () {
      handleBuyGift(gift, giftHeader);
    });
  }
};

var handleBuyGift = function handleBuyGift(gift, giftHeader) {
  // fetch request to add gift to user
  fetch(URL + "users/" + currentUser.id + "/buy", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gift_id: gift.id
    })
  }).then(function (res) {
    return res.json();
  }).then(function (updatedUser) {
    // update user data
    currentUser = updatedUser; // track gift

    myGiftIds.push(gift.id); // update DOM - inventory

    var inventoryDiv = document.querySelector("#inventory-container");
    renderInventoryItem(gift, inventoryDiv); // update DOM - rerender purchase options (less currency, updated inventory)

    giftHeader.innerHTML = "";
    giftHeader.innerText = "Get A Gift!";
    fetchGiftsIndex(giftHeader); // update DOM - display correct amount of currency

    var currencyText = document.querySelector("#currency-display").firstChild;
    currencyText.nodeValue = "Social Energy: " + currentUser.points + "💕";
  });
};

var deleteUserShowButton = function deleteUserShowButton() {
  var button = document.querySelector("#user-show-button");
  button.remove();
};