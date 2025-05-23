const labels = document.getElementsByTagName("label")
const inputs = document.getElementsByTagName("input")
const buttons = document.getElementsByTagName("button")
const form = document.getElementById("formLinkPython")
const body = document.getElementById("mainBody")

body.removeChild(form)



//when loading the page, get how many users are there.
window.addEventListener("load",loadingPageBasedOnUserCount);

function loadingPageBasedOnUserCount(){    
    //run numberOfUsers route
    fetch('http://localhost:8000/usersName')
        .then(response => response.json())
        .then(data => {
            //unable to assign null to numberOfUsers therefore assign 0 to it
            if(data.userCount==null){
                data.userCount = 0;
            }

            // Assuming the response is a JSON object with a 'number' property
            const numberOfUsers = data.userCount;
            
            // First ever login will be an instruction and welcoming message
            if(numberOfUsers == 0){
                document.getElementById('headLine').innerHTML = "Welcome to my~~~~ Worldddddd! Are you ready to dip into the world of music?Click on me to hop on!";
            }
            else{
                return;
            }
        })

        //in case there is an error
        .catch(error => console.error('Fetch error:', error));
}



function submitSong(event) {
            event.preventDefault(); // Stop normal form submission
            
            // Get the input value and modify it
            let searchInput = document.getElementById('queries');
            let searchValue = searchInput.value + "nhạc"; // Add " fat" to whatever was typed
            
            // Create the URL with modified value
            let numberValue = document.getElementById('numbers').value;
            let url = `http://localhost:8000/video/?queries=${encodeURIComponent(searchValue)}&numbers=${numberValue}`;
            
            // Redirect to the URL (sends modified data to Python)
            window.location.href = url;
            
            return false; // Prevent form from submitting normally
        }
