const labels = document.getElementsByTagName("label")
const inputs = document.getElementsByTagName("input")
const buttons = document.getElementsByTagName("button")
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")
const musicContainer = document.getElementById('musicContainer')


// temporary remove the part that are unecessary "yet from the body
body.removeChild(form)

//when loading the page, get how many users are there.
window.addEventListener("load",loadingPageBasedOnUserCount);

//variables
var musicList = [];
var numberOfUsers = 0;
var username = "";
var password = "";

//All the existing functions that are used in the HTML file

// Function to handle the login page
function loadingPageBasedOnUserCount(){    
    //run numberOfUsers route
    fetch('http://localhost:8000/usersName')
        .then(response => response.json())
        .then(data => {
            //unable to assign null to userCount therefore assign 0 to it
            if(data.userCount==null){
                data.userCount = 0;
            }

            else if(data.userCount>0){
            //if already got data, move to the login part.
                body.removeChild(document.getElementById('headLine'))
                body.appendChild(form)
            }
            
            numberOfUsers = data.userCount; // Assign the user count to the variable

            // First ever login will be an instruction and welcoming message and then move to the chat background function if clicked
            if(numberOfUsers == 0){
                document.getElementById('headLine').innerHTML = "Welcome to my~~~~ Worldddddd! Are you ready to dip into the world of music?Click on me to hop on!"
                document.getElementById('headLine').addEventListener("click",function(){
                    moveToChatBG()
                    body.removeChild(document.getElementById('headLine'))
                })
            }
            else{
                return;
            }
        })

        //in case there is an error
        .catch(error => console.error('Fetch error:', error));
    }

//move to the chat background
function moveToChatBG(){
    body.appendChild(form)
}

// Function to call the Python backend's getAllUserMusic route and display it in the list

function getAllUserMusic() {
    fetch(`http://localhost:8000/usersMusics/?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Music data received:', data.userMusic);
            // Assuming the response is a JSON object with a 'music' property
            musicList = data[0].userMusic || []; // Use an empty array if 'music' is not present
            console.log('Music List:', musicList);  
            // Clear previous music list
            musicContainer.innerHTML = '';

            // Populate the music list
            musicList.forEach(music => {
                const musicItem = document.createElement('li');
                musicItem.innerHTML = music.userMusic;   
                musicContainer.appendChild(musicItem);
            });
        })
        
        .catch(error => console.error('Fetch error:', error));
}    

//Login function that will be called when the form is submitted

function submitLogin(event) {

    // Get the input value and modify it
            let userNameInput = document.getElementById('userName').value;
            let passWordInput = document.getElementById('passWord').value;
            username = userNameInput;
            password = passWordInput;

    if(numberOfUsers==0){
            event.preventDefault(); // Stop normal form submission

            // Create the URL with values from the input fields
            let url = `http://localhost:8000/usersName/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`;
            
            // send a POST request to the Python backend
            fetch(url,{
                method: 'POST'
            })

            // Handle the response
            .then(response => response.json())
            .then(data => console.log('User added:', data))
            .catch(error => console.error('Error:', error));
            
            return false; // Prevent form from submitting normally=
    }
    else{
        event.preventDefault(); // Stop normal form submission
        
        //making the url 
        let url = `http://localhost:8000/checkingUserName/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`

        //if there is already a user, then login
        fetch(url,{
            method: 'GET'
        })
     
        //Handle the response
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Login successful:', data);
                // Call the function to get all user music
                getAllUserMusic();
                buttons[0].innerHTML = "Add Music";
                form.removeChild(document.getElementsByClassName("passWords")[0]);
                form.removeChild(document.getElementById("inputPassWord"))
                document.getElementsByClassName("userNames")[0].innerHTML = "Welcome " + username + "!";
                form.removeChild(document.getElementById("inputUserName"))
            } else {
                console.error('Login failed:', data.message|| data.message || data);
            }
        })
    }
}

// function to run the add music route
function addMusic() {
    // Get the input value and modify it
    let musicInput = document.getElementById('musicInput').value;

   // Create the URL with values from the input fields
    let url = `http://localhost:8000/addMusic/?username=${encodeURIComponent(username)}&music=${encodeURIComponent(musicInput)}`;

    // send a POST request to the Python backend
    fetch(url, {
        method: 'POST'
    })
    
    // Handle the response
    .then(response => response.json())
    .then(data => {
        body.appendChild(musicContainer);
        console.log('Music added:', data);
        // Refresh the music list after adding new music
        getAllUserMusic();
    })
    .catch(error => console.error('Error:', error));
}