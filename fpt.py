from fastapi import FastAPI, HTTPException
from userName import userNames, Musics
from typing import List
from googleapiclient.discovery import build


app = FastAPI()

from pymongo import MongoClient

client = MongoClient("mongodb://host.docker.internal:27017/")
db = client["userdb"]
collection = db["userNameList"]


@app.post("/usersName/")
def addUser(username:str, password:str ):# -> set[dict[str, Any]] | None:# -> set[dict[str, Any]] | None: 
    if collection.find_one({"userName": username}):
            raise HTTPException(status_code=400,detail="Already exists a same username")
        
    userId = collection.count_documents({}) + 1

    newUser = {
        "userId": userId,
        "userName": username,
        "passWord": password
    }
    collection.insert_one(newUser)
    users = list(collection.find({}, {"_id": 0}))
    print(users)
    return {str(userId),username,password}

youtube = build("youtube", "v3", developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")

@app.post("/usersMusic/")
def addMusic(username:str, userMusic:str):
    if not collection.find_one({"userName": username}):
        raise HTTPException(status_code=400, detail="User not found")
    
    request = youtube.search().list(
    q= userMusic,
    part="id",
    maxResults=1
    )
    response = request.execute()

    newMusic = {
        "userMusic": userMusic,
        "musicId": response["items"][0]["id"]["videoId"],
    }
    collection.update_one(
        {"userName": username},
        {"$push": {"userMusic": newMusic}}
    )

@app.get("/usersMusic/")
def getAllUserMusic(username:str):
    if not collection.find_one({"userName": username}):
        raise HTTPException(status_code=400, detail="User not found")
    return list(collection.find({"userName": username}, {"_id": 0, "userMusic": 1}))

@app.delete("/usersName/")
def deleteUser(username:str):
    if not collection.find_one({"userName": username}):
        raise HTTPException(status_code=400, detail="User not found")
    
    collection.delete_one({"userName": username})
    return {"message": "User deleted successfully"}

@app.delete("/usersMusic/")
def deleteMusic(username:str, userMusic:str):
    if not collection.find_one({"userName": username}):
        raise HTTPException(status_code=400, detail="User not found")
    collection.update_one(
        {"userName": username},
        {"$pull": {"userMusic": {"userMusic": userMusic}}}
    )
    return {"message": "Music deleted successfully"}