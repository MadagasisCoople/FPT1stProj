from fastapi import FastAPI, HTTPException
from userName import userNames
from pymongo import MongoClient

app = FastAPI()

cilent = MongoClient("mongodb://localhost:27017/")
db = cilent["userdb"]
collection = db["userNameList"]

@app.post("/usersName/")
def addUser(username:str, password:str ):# -> set[dict[str, Any]] | None:# -> set[dict[str, Any]] | None: 
    if collection.find_one({"username": username}):
            raise HTTPException(status_code=400,detail="Already exists a same username")
        
    userId = collection.count_documents({}) + 1

    newUser = {
        "userId": userId,
        "userName": username,
        "passWord": password
    }
    collection.insert_one(newUser)
    return {str(userId),username,password}
users = list(collection.find({}, {"_id": 0}))
print(users)