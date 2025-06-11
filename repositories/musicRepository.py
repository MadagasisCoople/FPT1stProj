# Music Repository Module
# Handles all music-related database operations including:
# - Music collection management
# - Music recommendations
# - Music selection based on preferences

from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from googleapiclient.discovery import build
print("Music repository initialized")

class musicRepository:
    """
    Repository class for handling music-related database operations
    """
    
    async def addMusic(self, username: str, userMusic: str, db):
        """
        Adds a new music entry to user's collection
        
        Args:
            username: Username of the user
            userMusic: Music identifier to add
            db: Database connection instance
            
        Returns:
            dict: Success status and message
        """
        youtube = build("youtube", "v3", developerKey="apiKEY")

        request = youtube.search().list(
            q=userMusic,
            part="id",
            maxResults=1
        )
        
        response = request.execute()
        newMusic = {
            "userMusic": userMusic,
            "musicId": response["items"][0]["id"]["videoId"],
        }

        collection = db["users"]
        await collection.update_one(
            {"userName": username},
            {"$push": {"userMusic": newMusic}}
        )

        return {
            "userMusic": userMusic,
            "musicId": response["items"][0]["id"]["videoId"]
        }

    async def getAllUserMusic(self, username: str, db):
        """
        Retrieves all music entries for a specific user
        
        Args:
            username: Username to fetch music for
            db: Database connection instance
            
        Returns:
            list: List of music documents
        """
        collection = db["users"]
        cursor = collection.find({"userName": username}, {"_id": 0, "userMusic": 1, "userMusicId": 1})
        result = await cursor.to_list(length=None)
        return result

    async def deleteMusic(self, username: str, userMusic: str, db):
        """
        Removes a music entry from user's collection
        
        Args:
            username: Username of the user
            userMusic: Music identifier to remove
            db: Database connection instance
            
        Returns:
            dict: Success status and message
        """
        collection = db["users"]
        await collection.update_one(
            {"userName": username},
            {"$pull": {"userMusic": {"userMusic": {
                "$regex": userMusic, "$options": "i"  # Case-insensitive match
            }}}}
        )
        return {"message": "Music deleted successfully"}
