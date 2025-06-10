# User Repository Module
# Handles all user-related database operations including:
# - User account management (creation, verification)
# - Music collection management
# - User statistics and counts

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
            "success":"True",
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

    async def addMusic(self, userName: str, userMusic: str, db):
        """
        Adds a new music entry to user's collection
        
        Parameters:
        - userName: User to add music for
        - userMusic: YouTube video URL/ID to add
        - db: Database connection instance
        
        Creates a music document with unique ID and adds to user's collection
        """
        collection = db["users"]
        
        # Create new music document
        newMusic = {
            "musicId": userMusic,
            "userMusic": userMusic
        }
        
        # Add music to user's collection
        await collection.update_one(
            {"userName": userName},
            {"$push": {"userMusic": newMusic}}
        )
        
        return {
            "success": True,
            "message": "Music added successfully"
        }

    async def deleteMusic(self, userName: str, userMusic: str, db):
        """
        Removes a music entry from user's collection
        
        Uses MongoDB $pull operator to remove matching music entry
        Returns success message if deletion successful
        """
        collection = db["users"]
        
        # Remove music from user's collection
        await collection.update_one(
            {"userName": userName},
            {"$pull": {"userMusic": {"musicId": userMusic}}}
        )
        
        return {
            "success": True,
            "message": "Music deleted successfully"
        }

    async def getAllUserMusic(self, userName: str, db):
        """
        Retrieves all music entries for a specific user
        
        Returns:
        - List of music documents containing musicId and userMusic fields
        - Empty list if user has no music
        """
        collection = db["users"]
        
        # Find user and project only music collection
        cursor = collection.find(
            {"userName": userName},
            {"userMusic": 1, "_id": 0}
        )
        
        result = await cursor.to_list(length=100)
        return result