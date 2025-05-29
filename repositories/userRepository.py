from infrastructure.mongoDB import mongoDB
from domain.Schema import userNames, Musics
print("User repository initialized")

class userRepository:
    
    async def addUser(self,username: str, password: str,db):
        collection = db["users"]
        userId = await collection.count_documents({}) + 1
        
        newUser = {
            "userId": userId,
            "userName": username,
            "passWord": password
        }
        await collection.insert_one(newUser)
        return {
            "userId":str(userId),
            "userName":username,
        }
    
    async def deleteAllUsers(self,db):
        collection = db["users"]
        await collection.delete_many({})
        return {"message": "All users deleted successfully"}
    
    async def deleteUser(self,username:str, db):
        collection = db["users"]
        await collection.delete_one({"userName": username})
        return {"message": "User deleted successfully"}
    
    async def numberOfUsers(self,db):
        collection = db["users"]
        userCount = await collection.count_documents({})
        return {"userCount": userCount}
    
    async def checkingUser(self,username:str,password:str, db):
        collection = db["users"]
        user = await collection.find_one({"userName": username, "passWord": password})
        if not user:
            return {"success": False, "message": "Invalid credentials"}
        return {
            "success": True,
            "userId": str(user["userId"]),
            "userName": user["userName"],
        }
    
    async def getUserId(self,username: str, db):
        collection = db["users"]
        user = await collection.find_one({"userName": username})
        return {"userId": str(user["userId"]) if user else None}