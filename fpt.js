// DOM Element References
// Labels and form elements
const labels = document.getElementsByTagName("label")
const inputs = document.getElementsByTagName("input")
const buttonWrapper = document.getElementsByClassName('button')

// Main container elements
const musicWebsite = document.getElementById("musicWebsite")
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")
const headLine = document.getElementById("headLine")
const musicContainer = document.getElementById('musicContainer')

// User authentication form elements
const lableInputUserName = document.getElementsByClassName("userNames")[0]
const labelInputPassWord = document.getElementsByClassName("passWords")[0]
const inputUserNameWrapper = document.getElementsByClassName('input')[0]
const inputPassWordWrapper = document.getElementsByClassName('input')[1]
const inputUserName = document.getElementById('inputUserName')
const inputPassWord = document.getElementById('inputPassWord')

// Button elements and their wrappers
const signUpButtonWrapper = document.getElementById('signUpButtons')
const signUpButton = document.getElementById('signUpButton')
const deleteButton = document.getElementById('deleteButton')
const deleteButtonWrapper = document.getElementById('deleteButtons')
const submitButton = document.getElementById("submitButton")
const submitButtonWrapper = document.getElementById('submitButtons')

// Card game related elements
const chessGameWeb = document.getElementById("chessGameWebsite")
const addCard = document.getElementById("addCard")
const allUsersCards = document.getElementById("getAllUsersCards")
const removeCard = document.getElementById("removeCard")
const battleCards = document.getElementById("battleCards")

// AI recommendation related elements
const aiWeb = document.getElementById("aiWebsite")
const recommendMusic = document.getElementById("recommendMusic")
const pickMusic = document.getElementById("pickMusic")

// Initial page setup - removing unnecessary elements
form.removeChild(deleteButtonWrapper)
musicWebsite.removeChild(form)
musicWebsite.removeChild(musicContainer)
form.removeChild(signUpButtonWrapper)
body.removeChild(chessGameWeb)
body.removeChild(aiWeb)

// Event Listeners
form.addEventListener("submit", submitLogin)
window.addEventListener("load", loadingPageBasedOnUserCount);

// Global variables
var musicList = []          // Stores user's music list
var numberOfUsers = 0       // Tracks total number of users
var username = ""          // Current user's username
var password = ""          // Current user's password
var musicInput = ""        // Temporary storage for music input
const APIURL = `http://localhost:8000`  // Base URL for API calls
var STATE = ""            // Current application state
var cardId1 = ""          // First card ID for battles
var username2 = ""        // Second user's username for battles
var cardId2 = ""          // Second card ID for battles

/**
 * Initial page load handler
 * Checks number of users and sets up appropriate page state
 */
function loadingPageBasedOnUserCount() {
    console.log("Loading page based on user count...");

    fetch('http://localhost:8000/numberOfUsers')
        .then(response => response.json())
        .then(data => {
            numberOfUsers = data.userCount || 0;
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
                musicWebsite.removeChild(headLine)
                openLoginPage()
            }
        })
        .catch(error => console.error('Fetch error:', error));
}

/**
 * Handles user login form submission
 * Validates credentials with backend and opens welcome page on success
 */
function submitLogin(event) {
    let userNameInput = inputUserName.value;
    let passWordInput = inputPassWord.value;
    username = userNameInput;
    password = passWordInput;

    event.preventDefault();

    let url = `http://localhost:8000/checkingUser/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`
    fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Login successful:', data);
                openWelcomePage();
                submitButton.removeEventListener("click", submitLogin)
                signUpButtonWrapper.removeEventListener("click", openSignUpPage)
            } else {
                console.error('Login failed:', data.message || data.message || data);
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Handles new user signup
 * Creates new user account and opens welcome page on success
 */
function submitSignup(event) {
    event.preventDefault();

    let userNameInput = inputUserName.value;
    let passWordInput = inputPassWord.value;
    username = userNameInput;
    password = passWordInput;

    let url = `http://localhost:8000/addUser/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`;

    fetch(url, {
        method: 'POST'
    })
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

/**
 * Opens the login page and sets up form elements
 */
function openLoginPage() {
    resetFormValue()

    console.log("Open login page")

    musicWebsite.appendChild(form)

    // Setup form labels
    if (form.contains(document.getElementsByClassName("userNames")[0])) {
        document.getElementsByClassName("userNames")[0].innerHTML = "May I have your account name please?"
        document.getElementsByClassName("passWords")[0].innerHTML = "Tell me a secret. *Your password*"
    }

    // Setup form elements
    form.appendChild(signUpButtonWrapper)
    if (musicWebsite.contains(musicContainer)) musicWebsite.removeChild(musicContainer);
    if (!form.contains(inputPassWordWrapper)) form.appendChild(inputPassWordWrapper);

    // Setup button handlers
    submitButton.innerHTML = "Songs comin for ya!";
    signUpButtonWrapper.removeEventListener("click", openLoginPage)
    signUpButtonWrapper.addEventListener("click", openSignUpPage)
    submitButton.addEventListener("click", submitLogin)
    submitButton.removeEventListener("click", submitSignup)
}

/**
 * Opens the signup page and sets up form elements
 */
function openSignUpPage() {
    resetFormValue()

    // Update form labels for signup
    document.getElementsByClassName("userNames")[0].innerHTML = "Time to sign up your username!"
    document.getElementsByClassName("passWords")[0].innerHTML = "And your password?"

    // Setup button handlers
    submitButton.removeEventListener("click", submitLogin)
    submitButton.addEventListener("click", submitSignup)
    signUpButton.innerHTML = "Thinking again?"
    signUpButtonWrapper.removeEventListener("click", openSignUpPage)
    signUpButtonWrapper.addEventListener("click", openLoginPage)
}

/**
 * Opens the welcome page after successful login/signup
 * Sets up main interface elements and loads user's music
 */
async function openWelcomePage() {
    resetFormValue()

    // Setup page structure
    if (!body.contains(musicWebsite)) body.appendChild(musicWebsite)
    if (body.contains(chessGameWeb)) body.removeChild(chessGameWeb)
    if (body.contains(aiWeb)) body.remmoveChild(aiWeb)

    getAllUserMusic()
    musicWebsite.prepend(musicContainer)

    // Clean up form elements
    if (form.contains(labelInputPassWord)) form.removeChild(labelInputPassWord)
    if (form.contains(inputPassWordWrapper)) form.removeChild(inputPassWordWrapper);
    if (!form.contains(signUpButtonWrapper)) form.appendChild(signUpButtonWrapper)

    // Setup button handlers
    submitButton.innerHTML = "You want to add more music?";
    submitButton.addEventListener("click", openAddMusicPage);

    signUpButton.innerHTML = "Wanna have some games?"
    signUpButton.addEventListener("click", openChessGamePage)

    // Add AI recommendation button if not present
    if (!musicWebsite.contains(document.getElementById("aiWebButton"))) {
        aiWebButtonWrapper = await document.createElement("div")
        aiWebButton = document.createElement("button")
        aiWebButton.type = "button"
        aiWebButton.id = "aiWebButton"
        aiWebButton.innerHTML = "Wanna have some AI helps?"
        aiWebButtonWrapper.className = "button"
        aiWebButtonWrapper.appendChild(aiWebButton)
        form.appendChild(aiWebButtonWrapper)
    }
}

/**
 * Opens the add music page and sets up form elements
 * @param {Event} event - The click event
 */
function openAddMusicPage(event) {
    event.preventDefault();

    // Remove signup button and add music input field
    form.removeChild(signUpButtons)
    form.insertBefore(inputUserNameWrapper, submitButtonWrapper);

    // Update form labels and button text
    document.getElementsByClassName("userNames")[0].innerHTML = "What music do you want to add?"
    submitButton.innerHTML = "Add music!"
    submitButton.addEventListener("click", addMusic)
    submitButton.removeEventListener("click", openAddMusicPage)
}

/**
 * Handles adding new music to user's collection
 * @param {Event} event - The form submission event
 */
function addMusic(event) {
    event.preventDefault();

    let musicInput = inputUserName.value;
    let url = `http://localhost:8000/addMusic/?username=${encodeURIComponent(username)}&music=${encodeURIComponent(musicInput)}`;

    fetch(url, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Music added:', data)
                openWelcomePage();
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Handles deleting music from user's collection
 * @param {Event} event - The form submission event
 */
function deleteMusic(event) {
    event.preventDefault();

    let musicInput = inputUserName.value;
    let url = `http://localhost:8000/deleteMusic/?username=${encodeURIComponent(username)}&music=${encodeURIComponent(musicInput)}`;

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Music deleted:', data)
                openWelcomePage();
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Resets form input values
 */
function resetFormValue() {
    inputUserName.value = "";
    inputPassWord.value = "";
}

/**
 * Resets form structure and button handlers
 */
function resetForm() {
    // Reset the form and buttons
    form.removeChild(inputUserNameWrapper);
    form.removeChild(submitButtonWrapper);
    form.removeChild(signUpButtonWrapper);
}

/**
 * Fetches and displays all music in user's collection
 */
function getAllUserMusic() {
    fetch(`http://localhost:8000/getAllUserMusic/?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            musicList = data[0].music || []
            musicContainer.innerHTML = "Your music:"
            musicList.forEach(music => {
                const musicItem = document.createElement("li")
                musicItem.innerHTML = music
                musicContainer.appendChild(musicItem)
            })
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Opens the card game page and sets up game elements
 * @param {Event} event - The click event
 */
function openChessGamePage(event) {
    event.preventDefault();

    // Setup page structure
    if (!body.contains(chessGameWeb)) body.appendChild(chessGameWeb)
    if (body.contains(musicWebsite)) body.removeChild(musicWebsite)
    if (body.contains(aiWeb)) body.removeChild(aiWeb)

    // Load user's cards
    getAllUsersCards()
}

/**
 * Fetches and displays all cards in user's collection
 */
function getAllUsersCards() {
    fetch(`http://localhost:8000/getAllUserCards/?userName=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            const cards = data[0].card || []
            allUsersCards.innerHTML = "All your cards in your deck!"
            cards.forEach(card => {
                const cardItem = document.createElement("li")
                cardItem.innerHTML = "Card name: "+card.cardName + "<br>" +"Card Id: " + card.cardId + "<br>" +"Card power: "+card.power
                allUsersCards.appendChild(cardItem)
            })
        })
}

/**
 * Opens the add card page and sets up form elements
 */
function openAddCardPage() {
    // Setup form for adding new cards
    const addCardForm = document.createElement("form")
    const cardNameInput = document.createElement("input")
    const cardPowerInput = document.createElement("input")
    const submitButton = document.createElement("button")

    // Configure form elements
    cardNameInput.type = "text"
    cardNameInput.placeholder = "Card Name"
    cardPowerInput.type = "number"
    cardPowerInput.placeholder = "Card Power"
    submitButton.type = "submit"
    submitButton.innerHTML = "Add Card"

    // Add event listener
    addCardForm.addEventListener("submit", submitAddCard)

    // Assemble form
    addCardForm.appendChild(cardNameInput)
    addCardForm.appendChild(cardPowerInput)
    addCardForm.appendChild(submitButton)
    addCard.appendChild(addCardForm)
}

/**
 * Opens the remove card page and sets up form elements
 */
function openRemoveCardPage() {
    // Setup form for removing cards
    const removeCardForm = document.createElement("form")
    const cardIdInput = document.createElement("input")
    const submitButton = document.createElement("button")

    // Configure form elements
    cardIdInput.type = "text"
    cardIdInput.placeholder = "Card ID"
    submitButton.type = "submit"
    submitButton.innerHTML = "Remove Card"

    // Add event listener
    removeCardForm.addEventListener("submit", submitRemoveCard)

    // Assemble form
    removeCardForm.appendChild(cardIdInput)
    removeCardForm.appendChild(submitButton)
    removeCard.appendChild(removeCardForm)
}

/**
 * Handles adding a new card to user's collection
 * @param {Event} event - The form submission event
 */
function submitAddCard(event) {
    event.preventDefault();

    const cardName = event.target[0].value;
    const cardPower = event.target[1].value;
    const url = `http://localhost:8000/addCard/?userName=${encodeURIComponent(username)}&cardName=${encodeURIComponent(cardName)}&power=${encodeURIComponent(cardPower)}`;

    fetch(url, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Card added:', data)
                openChessGamePage();
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Handles removing a card from user's collection
 * @param {Event} event - The form submission event
 */
function submitRemoveCard(event) {
    event.preventDefault();

    const cardId = event.target[0].value;
    const url = `http://localhost:8000/removeCard/?userName=${encodeURIComponent(username)}&cardId=${encodeURIComponent(cardId)}`;

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Card removed:', data)
                openChessGamePage();
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Handles card battle submission
 * @param {string} value - The battle state value
 */
function submitBattleButtonCard(value) {
    if (value === "first") {
        cardId1 = document.getElementById("cardIdInput").value;
        STATE = "second";
        document.getElementById("battleForm").reset();
        document.getElementById("battleLabel").innerHTML = "Enter second player's username:";
    } else if (value === "second") {
        username2 = document.getElementById("cardIdInput").value;
        STATE = "third";
        document.getElementById("battleForm").reset();
        document.getElementById("battleLabel").innerHTML = "Enter second player's card ID:";
    } else if (value === "third") {
        cardId2 = document.getElementById("cardIdInput").value;
        const url = `http://localhost:8000/battleCards/?userName1=${encodeURIComponent(username)}&cardId1=${encodeURIComponent(cardId1)}&userName2=${encodeURIComponent(username2)}&cardId2=${encodeURIComponent(cardId2)}`;

        fetch(url, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Battle result:', data)
                    resetBattleState();
                    openChessGamePage();
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

/**
 * Resets battle state variables
 */
function resetBattleState() {
    STATE = "";
    cardId1 = "";
    username2 = "";
    cardId2 = "";
}

/**
 * Opens the battle card page and sets up form elements
 */
function openBattleCardPage() {
    // Setup battle form
    const battleForm = document.createElement("form")
    const cardIdInput = document.createElement("input")
    const submitButton = document.createElement("button")
    const battleLabel = document.createElement("label")

    // Configure form elements
    cardIdInput.type = "text"
    cardIdInput.id = "cardIdInput"
    battleLabel.id = "battleLabel"
    battleLabel.innerHTML = "Enter your card ID:"
    submitButton.type = "submit"
    submitButton.innerHTML = "Submit"

    // Add event listener
    battleForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitBattleButtonCard(STATE);
    })

    // Assemble form
    battleForm.id = "battleForm"
    battleForm.appendChild(battleLabel)
    battleForm.appendChild(cardIdInput)
    battleForm.appendChild(submitButton)
    battleCards.appendChild(battleForm)
}

/**
 * Adds a return button to the welcome page
 */
async function addReturnWelcomePageButton() {
    const returnButtonWrapper = await document.createElement("div")
    const returnButton = document.createElement("button")
    returnButton.type = "button"
    returnButton.id = "returnButton"
    returnButton.innerHTML = "Return to Welcome Page"
    returnButtonWrapper.className = "button"
    returnButtonWrapper.appendChild(returnButton)
    returnButtonWrapper.addEventListener("click", returnToWelcomePage)
    form.appendChild(returnButtonWrapper)
}

/**
 * Returns to the welcome page
 */
function returnToWelcomePage() {
    openWelcomePage();
}

/**
 * Opens the AI recommendation page
 */
function openAiPage() {
    if (!body.contains(aiWeb)) body.appendChild(aiWeb)
    if (body.contains(musicWebsite)) body.removeChild(musicWebsite)
    if (body.contains(chessGameWeb)) body.removeChild(chessGameWeb)
}

/**
 * Opens the music recommendation page
 */
function openRecommendMusicPage() {
    const recommendForm = document.createElement("form")
    const queryInput = document.createElement("input")
    const submitButton = document.createElement("button")

    queryInput.type = "text"
    queryInput.placeholder = "Enter your music preferences"
    submitButton.type = "submit"
    submitButton.innerHTML = "Get Recommendations"

    recommendForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitQueryRecommendMusic(queryInput.value);
    })

    recommendForm.appendChild(queryInput)
    recommendForm.appendChild(submitButton)
    recommendMusic.appendChild(recommendForm)
}

/**
 * Submits music recommendation query
 * @param {string} query - The user's music preferences
 */
function submitQueryRecommendMusic(query) {
    const url = `http://localhost:8000/recommendMusic/?username=${encodeURIComponent(username)}&query=${encodeURIComponent(query)}`;

    fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Recommendations:', data)
                openAiPage();
            }
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Opens the music picker page
 */
function openPickMusicPage() {
    const pickForm = document.createElement("form")
    const queryInput = document.createElement("input")
    const submitButton = document.createElement("button")

    queryInput.type = "text"
    queryInput.placeholder = "Enter your mood or preference"
    submitButton.type = "submit"
    submitButton.innerHTML = "Pick Music"

    pickForm.addEventListener("submit", (event) => {
        event.preventDefault();
        submitQueryPickMusic(queryInput.value);
    })

    pickForm.appendChild(queryInput)
    pickForm.appendChild(submitButton)
    pickMusic.appendChild(pickForm)
}

/**
 * Submits music picker query
 * @param {string} query - The user's mood or preference
 */
function submitQueryPickMusic(query) {
    const url = `http://localhost:8000/pickMusic/?username=${encodeURIComponent(username)}&query=${encodeURIComponent(query)}`;

    fetch(url, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Picked music:', data)
                openAiPage();
            }
        })
        .catch(error => console.error('Error:', error));
}