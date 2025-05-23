from fastapi import FastAPI, HTTPException
from userName import userNames, Musics
from typing import List

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

@app.post("/usersMusic/")
def addMusic(username:str, userMusic:str):
    if not collection.find_one({"userName": username}):
        raise HTTPException(status_code=400, detail="User not found")

    newMusic = {
        "userMusic": userMusic,
    }
    collection.update_one(
        {"userName": username},
        {"$push": {"userMusic": newMusic}}
    )