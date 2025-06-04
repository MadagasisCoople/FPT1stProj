// DOM Elements - Labels, inputs, and wrappers for the user interface
const labels = document.getElementsByTagName("label")
//all inputs
const inputs = document.getElementsByTagName("input")
//all wrapper
const buttonWrapper = document.getElementsByClassName('button')
//form, body, headline and others HTML holder elements
const musicWebsite = document.getElementById("musicWebsite")
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")
const headLine = document.getElementById("headLine")
//music container
const musicContainer = document.getElementById('musicContainer')
//input and wrapper field for username and password
const lableInputUserName = document.getElementsByClassName("userNames")[0]
const labelInputPassWord = document.getElementsByClassName("passWords")[0]
const inputUserNameWrapper = document.getElementsByClassName('input')[0]
const inputPassWordWrapper = document.getElementsByClassName('input')[1]
const inputUserName = document.getElementById('inputUserName')
const inputPassWord = document.getElementById('inputPassWord')

//Buttons

//Sign up buttoms and its wrapper
const signUpButtonWrapper = document.getElementById('signUpButtons')
const signUpButton = document.getElementById('signUpButton')
//delete button and its wrapper
const deleteButton = document.getElementById('deleteButton')
const deleteButtonWrapper = document.getElementById('deleteButtons')
//submit button and its wrapper
const submitButton = document.getElementById("submitButton")
const submitButtonWrapper = document.getElementById('submitButtons')

//chess Game properties
const chessGameWeb = document.getElementById("chessGameWebsite")
const addCard = document.getElementById("addCard")
const allUsersCards = document.getElementById("getAllUsersCards")
const removeCard = document.getElementById("removeCard")
const battleCards = document.getElementById("battleCards")

//ai Website properties
const aiWeb = document.getElementById("aiWebsite")
const recommendMusic = document.getElementById("recommendMusic")
const pickMusic = document.getElementById("pickMusic")

// temporary remove the part that are unecessary "yet from the body
form.removeChild(deleteButtonWrapper)
musicWebsite.removeChild(form)
musicWebsite.removeChild(musicContainer)
form.removeChild(signUpButtonWrapper)
body.removeChild(chessGameWeb)
body.removeChild(aiWeb)

// adding event listener to the form for first run
form.addEventListener("submit", submitLogin)

//when loading the page, get how many users are there.
window.addEventListener("load", loadingPageBasedOnUserCount);

// Global variables to store application state
var aiWebButtonWrapper = "";
var musicList = [] // Stores the user's music collection
var numberOfUsers = 0 // Tracks total number of registered users
var username = "" // Current user's username
var password = "" // Current user's password
var musicInput = "" // Temporary storage for music input
const APIURL = `http://localhost:8000` // Base URL for the API
var STATE = "" // Current application state
var cardId1 = "" // First card ID for battle system
var username2 = "" // Second username for battle system
var cardId2 = "" // Second card ID for battle system

//All the existing functions that are used in the HTML file

// Function to handle initial page load and user count check
function loadingPageBasedOnUserCount() {
    console.log("Loading page based on user count...");

    //run numberOfUsers route
    fetch('http://localhost:8000/numberOfUsers')
        .then(response => response.json())
        .then(data => {
            numberOfUsers = data.userCount || 0; // Get the user count from the response, default to 0 if not present
            //unable to assign null to userCount therefore assign 0 to it
            if (data.userCount == null || data.userCount == 0) {
                console.log('User count data received:')
                data.userCount = 0;
                headLine.innerHTML = "Welcome to my~~~~ Worldddddd! Are you ready to dip into the world of music?Click on me to hop on!"
                headLine.addEventListener("click", function () {
                    openLoginPage();
                    musicWebsite.removeChild(headLine)
                })
            }

            else if (data.userCount > 0) {
                //if already got data, move to the login part.
                musicWebsite.removeChild(headLine)
                openLoginPage()
            }
        })
        //in case there is an error
        .catch(error => console.error('Fetch error:', error));
}

// Function to handle user login form submission
function submitLogin(event) {

    // Get the input value and modify it
    let userNameInput = inputUserName.value;
    let passWordInput = inputPassWord.value;
    username = userNameInput;
    password = passWordInput;

    event.preventDefault(); // Stop normal form submission

    //Function to handle the login form submission
    //making the url 
    let url = `http://localhost:8000/checkingUser/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`
    fetch(url, {
        method: 'GET'
    })

        //Handle the response
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Login successful:', data);
                //open the welcome page
                openWelcomePage();
                submitButton.removeEventListener("click", submitLogin)
                signUpButtonWrapper.removeEventListener("click", openSignUpPage)
            } else {
                console.error('Login failed:', data.message || data.message || data);
            }
        }
        )
        .catch(error => console.error('Error:', error));
}


// Function to handle new user registration
function submitSignup(event) {

    event.preventDefault(); // Stop normal form submission

    // Get the input value and modify it
    let userNameInput = inputUserName.value;
    let passWordInput = inputPassWord.value;
    username = userNameInput;
    password = passWordInput;

    // Create the URL with values from the input fields
    let url = `http://localhost:8000/addUser/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`;

    // send a POST request to the Python backend
    fetch(url, {
        method: 'POST'
    })

        // Handle the response
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('User added:', data)
                openWelcomePage();
                submitButton.removeEventListener("click", submitSignup)
                signUpButtonWrapper.removeEventListener("click", openLoginPage)
            }
        })
        .catch(error => console.error('Error:', error));
}


// Function to display the login page interface
function openLoginPage() {
    resetFormValue()

    console.log("Open login page")

    musicWebsite.appendChild(form)

    //Form label setup
    if (form.contains(document.getElementsByClassName("userNames")[0])) {
        document.getElementsByClassName("userNames")[0].innerHTML = "May I have your account name please?"
        document.getElementsByClassName("passWords")[0].innerHTML = "Tell me a secret. *Your password*"
    }

    //Form setup
    form.appendChild(signUpButtonWrapper)
    if (musicWebsite.contains(musicContainer)) musicWebsite.removeChild(musicContainer);
    if (!form.contains(inputPassWordWrapper)) form.appendChild(inputPassWordWrapper);

    //Handling submit button
    submitButton.innerHTML = "Songs comin for ya!";
    signUpButtonWrapper.removeEventListener("click", openLoginPage)
    signUpButtonWrapper.addEventListener("click", openSignUpPage)
    submitButton.addEventListener("click", submitLogin)
    submitButton.removeEventListener("click", submitSignup)
}

// Function to display the signup page interface
function openSignUpPage() {

    resetFormValue()

    //Form label setup
    document.getElementsByClassName("userNames")[0].innerHTML = "Time to sign up your username!"
    document.getElementsByClassName("passWords")[0].innerHTML = "And your password?"

    //submit button setup
    submitButton.removeEventListener("click", submitLogin)
    submitButton.addEventListener("click", submitSignup)
    signUpButton.innerHTML = "Thinking again?"
    signUpButtonWrapper.removeEventListener("click", openSignUpPage)
    signUpButtonWrapper.addEventListener("click", openLoginPage)
}


// Function to display the welcome page after successful login/signup
async function openWelcomePage() {

    resetFormValue()

    if (!body.contains(musicWebsite)) body.appendChild(musicWebsite)
    if (body.contains(chessGameWeb)) body.removeChild(chessGameWeb)
    if (body.contains(aiWeb)) body.remmoveChild(aiWeb)

    getAllUserMusic()
    musicWebsite.prepend(musicContainer)

    //tke time till we need it again so but here to avoid error when we need to open Welcome page again
    if (form.contains(labelInputPassWord)) form.removeChild(labelInputPassWord)
    if (form.contains(inputPassWordWrapper)) form.removeChild(inputPassWordWrapper);
    if (!form.contains(signUpButtonWrapper)) form.appendChild(signUpButtonWrapper)

    submitButton.innerHTML = "You want to add more music?";
    submitButton.addEventListener("click", openAddMusicPage);

    signUpButton.innerHTML = "Wanna have some games?"
    signUpButton.addEventListener("click", openChessGamePage)

    if (!musicWebsite.contains(document.getElementById("aiWebButton"))) {
        aiWebButtonWrapper = await document.createElement("div")
        aiWebButton = document.createElement("button")
        aiWebButton.type = "button"
        aiWebButton.id = "aiWebButton"
        aiWebButton.innerHTML = "Wanna have some AI helps?"
        aiWebButtonWrapper.className = "button"
        aiWebButtonWrapper.id = "aiWebButtonWrapper"
        aiWebButtonWrapper.appendChild(aiWebButton)
        form.appendChild(aiWebButtonWrapper)
        aiWebButton.addEventListener("click", openAiPage)
        aiWebButtonWrapper = document.getElementById("aiWebButtonWrapper")
    }

    document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!";
    if (form.contains(inputUserNameWrapper)) form.removeChild(inputUserNameWrapper)
}

// Function to display the music addition page
function openAddMusicPage(event) {

    resetFormValue()

    event.preventDefault(); // Stop normal form submission

    //Taking out the inputing box
    form.removeChild(aiWebButtonWrapper)
    form.removeChild(signUpButtons)
    form.insertBefore(inputUserNameWrapper, submitButtonWrapper);
    submitButton.removeEventListener("click", openAddMusicPage);

    // Add button 
    submitButton.addEventListener("click", addMusic);
    submitButton.innerHTML = "Add Music!";
    document.getElementsByClassName("userNames")[0].innerHTML = "Please input the music you want to add/delete!";

    // Delete button
    form.appendChild(deleteButtonWrapper);
    deleteButton.addEventListener("click", deleteMusic);
}

// Function to add new music to user's collection
async function addMusic(event) {
    event.preventDefault(); // Stop normal form submission
    // Get the input value and modify it
    musicInput = inputUserName.value;

    // Create the URL with values from the input fields
    let url = `http://localhost:8000/addMusic/?username=${encodeURIComponent(username)}&userMusic=${encodeURIComponent(musicInput)}`;

    // send a POST request to the Python backend
    await fetch(url, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Music added:', data);
            return getAllUserMusic(); // Return the promise from getAllUserMusic
        })
        .then(() => {
            resetForm(); // Only reset form after getAllUserMusic completes
        })
        .catch(error => console.error('Error:', error));
}

// Function to remove music from user's collection
function deleteMusic(event) {
    event.preventDefault(); // Stop normal form submission

    musicInput = inputUserName.value;
    fetch(`http://localhost:8000/deleteMusic/?username=${encodeURIComponent(username)}&userMusic=${encodeURIComponent(musicInput)}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Music deleted:', data);
            return getAllUserMusic(); // Return the promise from getAllUserMusic
        })
        .then(() => {
            resetForm(); // Only reset form after getAllUserMusic completes
        })
        .catch(error => console.error('Error:', error));
}

// Function to reset form input values
function resetFormValue() {

    //Reset data
    for (var i = 0; i < inputs.length; i++) inputs[i].value = ""

}

// Function to reset the entire form state
function resetForm() {

    // Reset the form and buttons
    if(form.contains(inputUserNameWrapper)) form.removeChild(inputUserNameWrapper);
    submitButton.innerHTML = "You want to add more music?";
    submitButton.removeEventListener("click", addMusic);
    document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!"
    submitButton.addEventListener("click", openAddMusicPage);
    if(form.contains(deleteButtonWrapper)) form.removeChild(deleteButtonWrapper);
    if (!(form.contains(signUpButtonWrapper))) form.append(signUpButtonWrapper)
    if(!form.contains(aiWebButtonWrapper)) form.append(aiWebButtonWrapper)
    }

// Function to fetch and display all user's music
function getAllUserMusic() {
    fetch(`http://localhost:8000/getAllUserMusic/?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            // Assuming the response is a JSON object with a 'music' property
            musicList = data[0].userMusic || []; // Use an empty array if 'music' is not present
            // Clear previous music list
            musicContainer.innerHTML = 'Your Music List:';

            // Populate the music list
            musicList.forEach(music => {
                const musicItem = document.createElement('li');
                musicItem.innerHTML = music.userMusic + " (" + music.musicId + ")";
                musicContainer.appendChild(musicItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
    console.log('Music List:', musicList);
}

// Function to open the chess game interface
function openChessGamePage(event) {

    event.preventDefault()

    if (!body.contains(chessGameWeb)) body.appendChild(chessGameWeb)
    if (body.contains(musicWebsite)) body.removeChild(musicWebsite)
    if (body.contains(aiWeb)) body.remmoveChild(aiWeb)

    addReturnWelcomePageButton()

    resetFormValue()

    addCard.addEventListener("click", openAddCardPage)
    removeCard.addEventListener("click", openRemoveCardPage)
    battleCards.addEventListener("click", openBattleCardPage)

    getAllUsersCards()
}

// Function to fetch all user cards for the game
function getAllUsersCards() {
    fetch(`http://localhost:8000/getAllUserCards/?userName=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            // Assuming the response is a JSON object with a 'music' property
            const cards = data[0].card || []; // Use an empty array if 'music' is not present
            // Clear previous music list
            allUsersCards.innerHTML = 'Your Cards List:';

            // Populate the music list
            cards.forEach(card => {
                const cardItem = document.createElement('li');
                cardItem.innerHTML = "Card Name: " + card.cardName + "<br>" + "Card Id: " + card.cardId + "<br>" + "Power: " + card.power
                allUsersCards.appendChild(cardItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
}

// Function to display the card addition interface
function openAddCardPage() {

    resetFormValue()

    if (!addCard.contains(document.getElementById("inputAddCard"))) {
        const inputAddCard = document.createElement("input")
        inputAddCard.id = "inputAddCard"
        document.getElementById("addCard").appendChild(inputAddCard)
        const buttonAddCard = document.createElement("button")
        document.getElementById("addCard").appendChild(buttonAddCard)
        buttonAddCard.style.height = "20px"
        buttonAddCard.style.width = "18px"
        buttonAddCard.id = "buttonAddCard"
        buttonAddCard.innerHTML = "+" // Add text to the button
        buttonAddCard.addEventListener("click", submitAddCard)
        addCard.removeEventListener("click", openAddCardPage)
    }
}

// Function to display the card removal interface
function openRemoveCardPage() {

    resetFormValue()

    if (!removeCard.contains(document.getElementById("inputRemoveCard"))) {
        const inputRemoveCard = document.createElement("input")
        inputRemoveCard.id = "inputRemoveCard"
        document.getElementById("removeCard").appendChild(inputRemoveCard)
        const buttonRemoveCard = document.createElement("button")
        document.getElementById("removeCard").appendChild(buttonRemoveCard)
        buttonRemoveCard.style.height = "20px"
        buttonRemoveCard.style.width = "18px"
        buttonRemoveCard.id = "buttonRemoveCard"
        buttonRemoveCard.innerHTML = "+" // Add text to the button
        buttonRemoveCard.addEventListener("click", submitRemoveCard)
        removeCard.removeEventListener("click", openRemoveCardPage)
    }
}

// Function to handle adding new cards
function submitAddCard() {
    const cardId = document.getElementById("inputAddCard").value

    fetch(`http://localhost:8000/addCard/?userName=${encodeURIComponent(username)}&musicId=${encodeURIComponent(cardId)}`, {
        method: "POST"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Card added successfully:', data);
            getAllUsersCards(); // Refresh the cards list
        })
        .catch(error => {
            console.error('Error adding card:', error);
        })
        .finally(() => {
            // Clean up elements regardless of success/failure
            const inputElement = document.getElementById("inputAddCard");
            const buttonElement = document.getElementById("buttonAddCard");
            if (inputElement) addCard.removeChild(inputElement);
            if (buttonElement) addCard.removeChild(buttonElement);
            addCard.addEventListener("click", openAddCardPage);
        });
}

// Function to handle removing cards
function submitRemoveCard() {
    const cardId = document.getElementById("inputRemoveCard").value

    fetch(`http://localhost:8000/removeCard/?userName=${encodeURIComponent(username)}&cardId=${encodeURIComponent(cardId)}`, {
        method: "GET"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Card removed successfully:', data);
            getAllUsersCards(); // Refresh the cards list
        })
        .catch(error => {
            console.error('Error removing card:', error);
        })
        .finally(() => {
            // Clean up elements regardless of success/failure
            const inputElement = document.getElementById("inputRemoveCard");
            const buttonElement = document.getElementById("buttonRemoveCard");
            if (inputElement) removeCard.removeChild(inputElement);
            if (buttonElement) removeCard.removeChild(buttonElement);
            removeCard.addEventListener("click", openRemoveCardPage);
        });
}

// Function to handle card battle submissions
function submitBattleButtonCard(value) {
    if (!value || value.trim() === "") {
        console.error("Please enter a valid value");
        return false;
    }

    switch (STATE) {
        case "player1 card":
            cardId1 = value;
            break;
        case "player2 name":
            username2 = value;
            break;
        case "player2 card":
            cardId2 = value;
            break;
    }
    return true;
}

// Function to reset the battle state
function resetBattleState() {
    STATE = "";
    cardId1 = "";
    username2 = "";
    cardId2 = "";
}

// Function to display the card battle interface
function openBattleCardPage() {

    resetFormValue()

    if (!battleCards.contains(document.getElementById("inputBattleCards"))) {
        const inputBattleCards = document.createElement("input")
        inputBattleCards.id = "inputBattleCards"
        document.getElementById("battleCards").appendChild(inputBattleCards)
        const buttonBattleCards = document.createElement("button")
        document.getElementById("battleCards").appendChild(buttonBattleCards)
        buttonBattleCards.style.height = "20px"
        buttonBattleCards.style.width = "18px"
        buttonBattleCards.id = "buttonBattleCards"
        buttonBattleCards.innerHTML = "+" // Add text to the button

        battleCards.removeEventListener("click", openBattleCardPage)
        buttonBattleCards.addEventListener("click", openBattleCardPage)
    }

    if (STATE == "") {
        STATE = "player1 card"
        inputBattleCards.value = ""
        inputBattleCards.placeholder = "Enter your card ID"
    }

    else if (STATE == "player1 card") {
        if (!submitBattleButtonCard(inputBattleCards.value)) return;
        inputBattleCards.value = ""
        STATE = "player2 name"
        inputBattleCards.placeholder = "Enter opponent's username"
    }

    else if (STATE == "player2 name") {
        if (!submitBattleButtonCard(inputBattleCards.value)) return;
        STATE = "player2 card"
        inputBattleCards.value = ""
        inputBattleCards.placeholder = "Enter opponent's card ID"
    }
    else if (STATE == "player2 card") {
        if (!submitBattleButtonCard(inputBattleCards.value)) return;
        inputBattleCards.value = ""
        battleCards.removeChild(inputBattleCards)
        battleCards.removeChild(buttonBattleCards)
        battleCards.addEventListener("click", openBattleCardPage)
        battleCards.removeEventListener("click", openBattleCardPage)

        fetch(`http://localhost:8000/battleCard/?userName1=${encodeURIComponent(username)}&userName2=${encodeURIComponent(username2)}&cardId1=${encodeURIComponent(cardId1)}&cardId2=${encodeURIComponent(cardId2)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Battle result:', data);
                // Display battle result to user
                const resultDiv = document.createElement('div');
                resultDiv.innerHTML = `Battle Result: ${data.message}`;
                battleCards.appendChild(resultDiv);
                // Clean up after 3 seconds
                setTimeout(() => {
                    battleCards.removeChild(resultDiv);
                }, 6000);
            })
            .catch(error => {
                console.error('Error in battle:', error);
                const errorDiv = document.createElement('div');
                errorDiv.innerHTML = `Error: ${error.message}`;
                errorDiv.style.color = 'red';
                battleCards.appendChild(errorDiv);
                // Clean up error message after 3 seconds
                setTimeout(() => {
                    battleCards.removeChild(errorDiv);
                }, 5000);
            })
            .finally(() => {
                resetBattleState(); // Reset all state variables
            });
    }
}

// Function to add a return button to welcome page
async function addReturnWelcomePageButton() {

    if (!document.getElementsByClassName("backGround")[0].contains(document.getElementById("returnButtonWrapper"))) {
        const returnButton = await document.createElement("button")
        const returnButtonWrapper = document.createElement("div")

        returnButton.id = "returnButton"
        returnButton.innerHTML = "Back to the Welcome town"
        returnButtonWrapper.className = "input"
        returnButtonWrapper.id = "returnButtonWrapper"

        returnButtonWrapper.appendChild(returnButton)
        returnButton.addEventListener("click", returnToWelcomePage)

        document.getElementsByClassName("backGround")[0].appendChild(returnButtonWrapper)
    }
}

// Function to return to the welcome page
function returnToWelcomePage() {
    if (body.contains(aiWeb)) body.removeChild(aiWeb)
    if (body.contains(chessGameWeb)) body.removeChild(chessGameWeb)
    openWelcomePage()
    resetForm()
}

// Function to open the AI features page
function openAiPage() {

    if (!body.contains(aiWeb)) body.appendChild(aiWeb)
    if (body.contains(chessGameWeb)) body.removeChild(chessGameWeb)
    if (body.contains(musicWebsite)) body.removeChild(musicWebsite)

    addReturnWelcomePageButton()
    
    recommendMusic.addEventListener("click", openRecommendMusicPage)
    pickMusic.addEventListener("click", openPickMusicPage)
    
}

// Function to open the music recommendation page
function openRecommendMusicPage() {
    if (!recommendMusic.contains(document.getElementById("inputQuery"))) {
        const inputQuery = document.createElement("input")
        inputQuery.id = "inputQuery"
        recommendMusic.appendChild(inputQuery)
        const buttonQuery = document.createElement("button")
        recommendMusic.appendChild(buttonQuery)
        buttonQuery.style.height = "20px"
        buttonQuery.style.width = "18px"
        buttonQuery.id = "buttonQuery"
        buttonQuery.innerHTML = "+" // Add text to the button
        buttonQuery.addEventListener("click", (query)=>submitQueryRecommendMusic(inputQuery.value,query))
        recommendMusic.removeEventListener("click", openRecommendMusicPage)
    }
}

// Function to handle music recommendation queries
function submitQueryRecommendMusic(query) {
    fetch(`http://localhost:8000/aiSuggestMusic/?query=${encodeURIComponent(query)}`, {
        method: "POST"
    })
        .then(response => {
            console.log("runned")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
        })
}

// Function to open the music picker page
function openPickMusicPage() {
    if (!pickMusic.contains(document.getElementById("inputQuery"))) {
        const inputQuery = document.createElement("input")
        inputQuery.id = "inputQuery"
        pickMusic.appendChild(inputQuery)
        const buttonQuery = document.createElement("button")
        pickMusic.appendChild(buttonQuery)
        buttonQuery.style.height = "20px"
        buttonQuery.style.width = "18px"
        buttonQuery.id = "buttonQuery"
        buttonQuery.innerHTML = "+" // Add text to the button
        buttonQuery.addEventListener("click", (query)=>submitQueryPickMusic(inputQuery.value,query))
        pickMusic.removeEventListener("click", openRecommendMusicPage)
    }
}

// Function to handle music picker queries
function submitQueryPickMusic(query) {
    fetch(`http://localhost:8000/aiPickMusic/?username=${encodeURIComponent(username)}&query=${encodeURIComponent(query)}`, {
        method: "POST"
    })
        .then(response => {
            console.log("runned")
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
        })
}

