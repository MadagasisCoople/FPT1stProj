# Music Service Module
# Handles music-related business logic and validation
from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError 
print("Music service initialized")

class musicService:
    """
    Service class for handling music-related operations
    Provides validation and business logic for music management
    """

    @staticmethod
    async def addMusic(username: str, userMusic: str, db):
        """
        Validate music addition request
        
        Args:
            username: Username to validate
            userMusic: Music to add
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
            songConflictError: If music already exists in user's collection
        """
        collection = db["users"]
        user = await collection.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()
        
        music = await collection.find_one({
            "userName": username,
            "userMusic.userMusic": {"$regex": userMusic, "$options": "i"}
        })
        if music:
            raise songConflictError()
        
    @staticmethod
    async def getAllUserMusic(username: str, db):
        """
        Validate music retrieval request
        
        Args:
            username: Username to validate
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
        """
        collection = db["users"]
        user = await collection.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()
        
    @staticmethod
    async def deleteMusic(username:str, userMusic:str, db):
        """
        Validate music deletion request
        
        Args:
            username: Username to validate
            userMusic: Music to delete
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username/music combination doesn't exist
        """
        collection = db["users"]
        user = await collection.find_one({"userName": username,"userMusic.userMusic": {"$regex": userMusic, "$options": "i"}})
        if not user:
            raise userNameNotFoundError(detail="Unable to dig up that song/username")
        