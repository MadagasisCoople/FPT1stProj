from infrastructure.mongoDB import mongoDB
from domain.Schema import userNames, Musics
from fastapi import FastAPI, Depends

class UserRepository:
    
    @staticmethod
    async def add_user(username: str, password: str,db):
        
        userId = db.count_documents({}) + 1
        
        newUser = {
            "userId": userId,
            "userName": username,
            "passWord": password
        }
        db.insert_one(newUser)
        return {
        "userId":str(userId),
        "userName":username,}
    
    @staticmethod
    async def deleteAllUsers(db):
        # Check if the user exists
        db.delete_many()
        return {"message": "All users deleted successfully"}
    
    @staticmethod
    async def deleteUser(username:str, db):
        db.delete_one({"userName": username})
        return {"message": "User deleted successfully"}
    
    @staticmethod
    async def numberOfUsers(db):
        userCount = db.count_documents({})
        return {"userCount": userCount}
    
    @staticmethod
    async def checkingUser(username:str,password:str, db):
        user = db.find_one({"userName": username, "passWord": password})  
        return {
        "success": True,
        "userId": str(user["userId"]),
        "userName": user["userName"],}
    
    @staticmethod
    def getUserId(username: str, db):
        user = db.find_one({"userName": username})
        return {"userId": str(user["userId"])}