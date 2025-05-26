const labels = document.getElementsByTagName("label")
const inputs = document.getElementsByTagName("input")
const buttons = document.getElementsByTagName("button")
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")
const musicContainer = document.getElementById('musicContainer')

// temporary remove the part that are unecessary "yet from the body
body.removeChild(form)
body.removeChild(musicContainer)

//when loading the page, get how many users are there.
window.addEventListener("load",loadingPageBasedOnUserCount);

//variables
var musicList = [];


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

            // Assuming the response is a JSON object with a 'number' property
            const numberOfUsers = data.userCount
            
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



// Function to call the Python backend's getAllUserMusic route
function getAllUserMusic() {
    fetch('http://localhost:8000/getAllUserMusic')
        .then(response => response.json())
        .then(data => {
            // Assuming the response is a JSON object with a 'music' property
            musicList = data.music || []; // Use an empty array if 'music' is not present
            
            // Clear previous music list
            musicContainer.innerHTML = '';

            // Populate the music list
            musicList.forEach(music => {
                const musicItem = document.createElement('li');
                musicItem.textContent = music;
                musicContainer.appendChild(musicItem);
            });
        })
        .catch(error => console.error('Fetch error:', error));
}    

function submitSong(event) {
            event.preventDefault(); // Stop normal form submission
            
            // Get the input value and modify it
            let userNameInput = document.getElementById('userName').value;
            let passWordInput = document.getElementById('passWord').value;
            console.log('User Name:', userNameInput);
            console.log('Password:',    passWordInput);

            // Create the URL with modified value
            let url = `http://localhost:8000/usersName/?username=${encodeURIComponent(userNameInput)}&password=${encodeURIComponent(passWordInput)}`;
            
            // Redirect to the URL (sends modified data to Python)
            fetch(url,{
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => console.log('User added:', data))
            .catch(error => console.error('Error:', error));
            
            return false; // Prevent form from submitting normally=
        }
