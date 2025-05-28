from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError 
print("Music service initialized")
class musicService:

    @staticmethod
    async def addMusic(username: str, userMusic: str, db):
        if not db.find_one({"userName":username}):
            raise userNameNotFoundError()
        if db.find_one({"userMusic.userMusic": {"$regex": userMusic, "$options": "i"  # Case-insensitive match
        }}):
            raise songConflictError()
        
    @staticmethod
    async def getAllUserMusic(username: str, db):
        if not db.find_one({"userName":username}):
            raise userNameNotFoundError()
        
    @staticmethod
    async def deleteMusic(username:str, userMusic:str, db):
        if not db.find_one({"userName": username}):
            raise userNameNotFoundError()