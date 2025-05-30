from infrastructure.mongoDB import mongoDB
from domain.Schema import cardNames, userNames, Musics
from domain.Error import cardNameConflictError, cardNameNotFoundError, userNameNotFoundError

class cardService:
    
    async def addCard(self, userName: str, musicId: str, db):

        collection = db["users"]

        carduser = collection.find_one({
            "userName": userName
        })

        if not await carduser: raise userNameNotFoundError

        card = collection.find_one({
            "userName": userName,
            "card.cardId":musicId
            })
        
        if await card: raise cardNameConflictError  

    async def removeCard(self, userName: str, cardId: str, db):

        collection = db["users"]

        carduser = collection.find_one({
            "userName": userName
        })

        if not await carduser: raise userNameNotFoundError

        card = collection.find_one({
            "userName": userName,
            "card.cardId": cardId
        })

        if not await card: raise cardNameNotFoundError

    async def getAllUsersCards(self, userName: str,db):

        collection = db["users"]

        carduser = collection.find_one({
            "userName": userName
        })

        if not await carduser: raise userNameNotFoundError

    async def battleCards(self, userName1: str, userName2: str, cardId1: str, cardId2: str, db):

        collection = db["users"]

        card1 = collection.find_one({
            "userName": userName1,
            "card.cardId": cardId1
            }
        )

        if not await card1: raise cardNameNotFoundError(detail= "Unable to dig up user 1 card name!")

        card2 = collection.find_one({
            "userName": userName2,
            "card.cardId" : cardId2
        })

        if not await card2: raise cardNameNotFoundError(detail= "Unable to dig up user 2 card name!")
        