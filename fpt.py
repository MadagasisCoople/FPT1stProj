from fastapi import FastAPI, HTTPException
from domain.Schema import userNames, Musics
from googleapiclient.discovery import build
from core.lifespan import lifespanConnect
from fastapi.middleware.cors import CORSMiddleware
from infrastructure.mongoDB import getMongoDB
from fastapi import Depends
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError
app = FastAPI(lifespan=lifespanConnect)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#Create a new user
@app.post("/usersName/")
def addUser(username:str, password:str, db = Depends(getMongoDB(app))):# -> set[dict[str, Any]] | None:# -> set[dict[str, Any]] | None: 
    if db.find_one({"userName": username}): # Check if the username already exists
            raise userNameConflictError()
        
    userId = db.count_documents({}) + 1

    newUser = {
        "userId": userId,
        "userName": username,
        "passWord": password
    }

    #add user to the database and return the user
    db.insert_one(newUser)
    return {
        "userId":str(userId),
        "userName":username,}

#setup youtube api
youtube = build("youtube", "v3", developerKey="put your own")

# Create a new music for a specific user
@app.post("/usersMusic/")
def addMusic(username:str, userMusic:str, db = Depends(getMongoDB(app))):
    # Check if the user exists
    if not db.find_one({"userName":username
}):
        raise userNameNotFoundError()
    if db.find_one({"userMusic.userMusic": {
            "$regex": userMusic, "$options": "i"  # Case-insensitive match
        }}):
        raise songConflictError()
    #request to youtube api
    request = youtube.search().list(
    q= userMusic,
    part="id",
    maxResults=1
    )
    response = request.execute()

    #Set the music and update the user
    newMusic = {
        "userMusic": userMusic,
        "musicId": response["items"][0]["id"]["videoId"],
    }
    db.update_one(
        {"userName": username},
        {"$push": {"userMusic": newMusic}})
    return { 
        "userMusic": userMusic,
        "musicId": response["items"][0]["id"]["videoId"]
    }

#get all music for a specific user
@app.get("/usersMusics/")
def getAllUserMusic(username:str, db = Depends(getMongoDB(app))):
    if not db.find_one({"userName":username}):
        raise userNameNotFoundError()
    return list(db.find({"userName": username}, {"_id": 0, "userMusic": 1}))

#delete all users
@app.delete("/usersName/all")
def deleteAllUsers(db = Depends(getMongoDB(app))):
    db.delete_many({})
    return {"mes.sage": "All users deleted successfully"}

#delete a specific user
@app.delete("/usersName/")
def deleteUser(username:str, db = Depends(getMongoDB(app))):
    if not db.find_one({"userName": username}):
        raise userNameNotFoundError()
    
    db.delete_one({"userName": username})
    return {"message": "User deleted successfully"}

#delete a specific music for a specific user
@app.delete("/usersMusic/")
def deleteMusic(username:str, userMusic:str, db = Depends(getMongoDB(app))):
    # Check if the user exists
    if not db.find_one({"userName": username}):
        raise userNameNotFoundError()   
    
    #delete the music
    db.update_one(
        {"userName": username},
        {"$pull": {"userMusic": {"userMusic": {
            "$regex": userMusic, "$options": "i"  # Case-insensitive match
        }}}}
    )
    return {"message": "Music deleted successfully"}

# Get the number of users
@app.get("/usersName/")
def numberOfUsers(db = Depends(getMongoDB(app))):
    userCount = db.count_documents({})
    return {"userCount": userCount}

@app.get("/checkingUserName/")
def checkingUser(username:str,password:str, db = Depends(getMongoDB(app))):
    user = db.find_one({"userName": username, "passWord": password})
    if not user:
        raise userNameNotFoundError()
    
    return {
        "success": True,
        "userId": str(user["userId"]),
        "userName": user["userName"],}

# Get user's ID by username
@app.get("/getUserId/")
def getUserId(username: str, db = Depends(getMongoDB(app))):
    user = db.find_one({"userName": username})
    if not user:
        raise userNameNotFoundError()
    
    return {"userId": str(user["userId"])}