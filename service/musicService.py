from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError 
print("Music service initialized")
class musicService:

    @staticmethod
    async def addMusic(username: str, userMusic: str, db):
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
        collection = db["users"]
        user = await collection.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()
        
    @staticmethod
    async def deleteMusic(username:str, userMusic:str, db):
        collection = db["users"]
        user = await collection.find_one({"userName": username,"userMusic.userMusic": {"$regex": userMusic, "$options": "i"}})
        if not user:
            raise userNameNotFoundError(detail="Unable to dig up that song/username")
        