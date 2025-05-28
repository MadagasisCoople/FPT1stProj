import infrastructure.mongoDB as mongoDB
from domain.Schema import userNames, Musics
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError
print("User service initialized")
class userService:
    
    async def addUser(self,username:str, db):
        if db.find_one({"userName": username}): # Check if the username already exists
            raise userNameConflictError()
        
    async def deleteUser(self,username:str, db):
        if not db.find_one({"userName": username}):
            raise userNameNotFoundError()
        
    async def checkingUser(self,username:str,password:str, db):
        user = db.find_one({"userName": username, "passWord": password})
        if not user:
            raise userNameNotFoundError()
    
    async def getUserId(self,username: str, db):
        user = db.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()