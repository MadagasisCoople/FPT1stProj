//all lable
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

// temporary remove the part that are unecessary "yet from the body
form.removeChild(deleteButtonWrapper)
musicWebsite.removeChild(form)
musicWebsite.removeChild(musicContainer)
form.removeChild(signUpButtonWrapper)
body.removeChild(chessGameWeb)

// adding event listener to the form for first run
form.addEventListener("submit", submitLogin)

//when loading the page, get how many users are there.
window.addEventListener("load", loadingPageBasedOnUserCount);

//variables
var musicList = []
var numberOfUsers = 0
var username = ""
var password = ""
var musicInput = ""
const APIURL = `http://localhost:8000` // Base URL for the API

//All the existing functions that are used in the HTML file

// Function to handle the login page
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

//Login function that will be called when the form is submitted

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
                submitButton.removeEventListener("click",submitLogin)
                signUpButtonWrapper.removeEventListener("click",openSignUpPage)
            } else {
                console.error('Login failed:', data.message || data.message || data);
            }
        }
        )
        .catch(error => console.error('Error:', error));
}


//Function to sign up
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
                submitButton.removeEventListener("click",submitSignup)
                signUpButtonWrapper.removeEventListener("click",openLoginPage)
            }
        })
        .catch(error => console.error('Error:', error));
}


//Function to open the login page
function openLoginPage() {

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

//function to open the sign up ppage
function openSignUpPage() {

    console.log("open Signup page")

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


//function to open the welcome page
function openWelcomePage() {
    getAllUserMusic()
    musicWebsite.prepend(musicContainer)
    
    //tke time till we need it again so but here to avoid error when we need to open Welcome page again
    if(form.contains(labelInputPassWord)) form.removeChild(labelInputPassWord)
    if(form.contains(inputPassWordWrapper)) form.removeChild(inputPassWordWrapper);
    if(!form.contains(signUpButtonWrapper)) form.appendChild(signUpButtonWrapper)

    submitButton.innerHTML = "You want to add more music?";
    submitButton.addEventListener("click", openAddMusicPage);
    
    signUpButton.innerHTML = "Wanna have some games?"
    signUpButton.addEventListener("click",openChessGamePage)

    document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!";
    form.removeChild(inputUserNameWrapper)
}

// function to open the add music route page
function openAddMusicPage(event) {

    event.preventDefault(); // Stop normal form submission

    //Taking out the inputing box

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

//function to add music to the user
function addMusic(event) {
    event.preventDefault(); // Stop normal form submission
    // Get the input value and modify it
    musicInput = inputUserName.value;

    // Create the URL with values from the input fields
    let url = `http://localhost:8000/addMusic/?username=${encodeURIComponent(username)}&userMusic=${encodeURIComponent(musicInput)}`;

    // send a POST request to the Python backend
    fetch(url, {
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

// Function to delete music from the user
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

// Function to reset the form      
function resetForm() {

    // Reset the form and buttons
    form.removeChild(inputUserNameWrapper);
    submitButton.innerHTML = "You want to add more music?";
    submitButton.removeEventListener("click", addMusic);
    document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!"
    submitButton.addEventListener("click", openAddMusicPage);
    form.removeChild(deleteButtonWrapper);
    if(!(form.contains(signUpButtonWrapper))) form.appendChild(signUpButtonWrapper)
}

// Function to call the Python backend's getAllUserMusic route and display it in the list

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
                musicItem.innerHTML = music.userMusic+" ("+music.musicId+")";
                musicContainer.appendChild(musicItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
    console.log('Music List:', musicList);
}

function openChessGamePage(event){

    event.preventDefault();

    body.appendChild(chessGameWeb)
    body.removeChild(musicWebsite)

    getAllUsersCards()
}

function getAllUsersCards(){
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
                cardItem.innerHTML = "Card Name: "+ card.cardName + "<br>" +"Card Id: " + card.cardId + "<br>" + "Power: " + card.power
                allUsersCards.appendChild(cardItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
    console.log('Cards list:', cards);
}

function openAddCardPage (){
    
}

fetch(`http://localhost:8000/addCard/?userName=${encodeURI(username)}&?musicId=${encodeURI()}`)