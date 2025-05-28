from infrastructure.mongoDB import mongoDB
from domain.Schema import userNames, Musics

class userRepository:
    
    async def addUser(self,username: str, password: str,db):
        
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
    
    async def deleteAllUsers(self,db):
        # Check if the user exists
        db.delete_many()
        return {"message": "All users deleted successfully"}
    
    async def deleteUser(self,username:str, db):
        db.delete_one({"userName": username})
        return {"message": "User deleted successfully"}
    
    async def numberOfUsers(self,db):
        userCount = db.count_documents({})
        return {"userCount": userCount}
    
    async def checkingUser(self,username:str,password:str, db):
        user = db.find_one({"userName": username, "passWord": password})  
        return {
        "success": True,
        "userId": str(user["userId"]),
        "userName": user["userName"],}
    
    async def getUserId(self,username: str, db):
        user = db.find_one({"userName": username})
        return {"userId": str(user["userId"])}