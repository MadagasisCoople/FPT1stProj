# Card Service Module
# Handles card game-related business logic and validation
from infrastructure.mongoDB import mongoDB
from domain.Schema import cardNames, userNames, Musics
from domain.Error import cardNameConflictError, cardNameNotFoundError, userNameNotFoundError

class cardService:
    """
    Service class for handling card game-related operations
    Provides validation and business logic for card management and battles
    """
    
    async def addCard(self, userName: str, musicId: str, db):
        """
        Validate card addition request
        
        Args:
            userName: Username to validate
            musicId: Music ID to create card from
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
            cardNameConflictError: If card already exists in user's collection
        """
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
        """
        Validate card removal request
        
        Args:
            userName: Username to validate
            cardId: Card ID to remove
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
            cardNameNotFoundError: If card doesn't exist in user's collection
        """
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
        """
        Validate card retrieval request
        
        Args:
            userName: Username to validate
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
        """
        collection = db["users"]

        carduser = collection.find_one({
            "userName": userName
        })

        if not await carduser: raise userNameNotFoundError

    async def battleCards(self, userName1: str, userName2: str, cardId1: str, cardId2: str, db):
        """
        Validate card battle request
        
        Args:
            userName1: Username of first player
            userName2: Username of second player
            cardId1: Card ID of first player
            cardId2: Card ID of second player
            db: Database connection instance
            
        Raises:
            cardNameNotFoundError: If either player's card doesn't exist
        """
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
        