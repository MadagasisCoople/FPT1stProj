//all lable
const labels = document.getElementsByTagName("label")
//all inputs
const inputs = document.getElementsByTagName("input")
//all wrapper
const buttonWrapper = document.getElementsByClassName('button')
//form, body, headline and others HTML holder elements
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")
const headLine = document.getElementById("headLine")
//music container
const musicContainer = document.getElementById('musicContainer')
//input and wrapper field for username and password
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

// temporary remove the part that are unecessary "yet from the body
form.removeChild(deleteButtonWrapper)
body.removeChild(form)
body.removeChild(musicContainer)
form.removeChild(signUpButtonWrapper)

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
                    body.removeChild(headLine)
                })
            }

            else if (data.userCount > 0) {
                //if already got data, move to the login part.
                body.removeChild(headLine)
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
            }
        })
        .catch(error => console.error('Error:', error));
}


//Function to open the login page
function openLoginPage() {

    console.log("Open login page")

    //Form label setup
    if (form.contains(document.getElementsByClassName("userNames")[0])) {
        document.getElementsByClassName("userNames")[0].innerHTML = "May I have your account name please?"
        document.getElementsByClassName("passWords")[0].innerHTML = "Tell me a secret. *Your password*"
    }

    //Form setup
    body.appendChild(form)
    form.appendChild(signUpButtonWrapper)
    if (body.contains(musicContainer)) body.removeChild(musicContainer);
    if (!form.contains(inputPassWordWrapper)) body.appendChild(inputPassWordWrapper);

    //Handling submit button
    submitButton.innerHTML = "Songs comin for ya!";
    signUpButtonWrapper.removeEventListener("click", openLoginPage)
    signUpButtonWrapper.addEventListener("click", openSignUpPage)
    submitButton.addEventListener("click", submitLogin)
    submitButton.removeEventListener("click", sumbitSignup)
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
    getAllUserMusic();
    body.prepend(musicContainer);
    submitButton.innerHTML = "You want to add more music?";
    submitButton.addEventListener("click", openAddMusicPage);
    form.removeChild(document.getElementsByClassName("passWords")[0]);
    form.removeChild(inputPassWordWrapper);
    document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!";
    form.removeChild(inputUserNameWrapper)
}

// function to open the add music route page
function openAddMusicPage(event) {

    form.removeEventListener("submit", submitLogin);
    event.preventDefault(); // Stop normal form submission

    //Taking out the inputing box

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
                musicItem.innerHTML = music.userMusic;
                musicContainer.appendChild(musicItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
    console.log('Music List:', musicList);
}