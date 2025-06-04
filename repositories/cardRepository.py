# Card Repository Module
# Handles all card game-related database operations including:
# - Card collection management
# - Card battles
# - Card statistics

from domain.Schema import cardNames, userNames, Musics
from infrastructure.mongoDB import mongoDB
from googleapiclient.discovery import build

print("Card repository initialized")

class cardRepository:
    """
    Repository class for handling card game-related database operations
    """

    async def addCard(self, userName: str, musicId: str, db):
        """
        Adds a new card to user's collection
        
        Args:
            userName: Username of the card owner
            musicId: ID of the music associated with the card
            db: Database connection instance
            
        Returns:
            dict: Success status and card details
        """
        # setup youtube and search song
        youtube = build("youtube", "v3",
                        developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")
        request = youtube.search().list()(
            id=musicId,
            part="snippet,statistics"
        )

        response = request.execute()

        # Data getting for card
        viewCount = response["items"][0]["statistics"]["viewCount"]
        likeCount = response["items"][0]["statistics"]["likeCount"]
        # speical power adding to commentcount
        commentCount = response["items"][0]["statisctics"]["commentCount"] or 0
        Power = viewCount/likeCount + commentCount  # Power = average person/like
        cardName = response["items"][0]["snippet"]["title"]
        # creating new card
        newCard = {
            "cardId": musicId,
            "cardName": cardName,
            "power": Power,
            "specialPower": commentCount
        }

        # Adding a new card
        collection = db["users"]
        await collection.update_one(
            {"userName": userName},
            {"$push": {"card": newCard}}
        )

        # return values
        return {
            "userName": userName,
            "cardName": cardName,
            "power": Power,
            "likeCount": likeCount,
            "specialPower": commentCount
        }

    async def removeCard(self, userName: str, cardId: str, db):
        """
        Removes a card from user's collection
        
        Args:
            userName: Username of the card owner
            cardId: ID of the card to remove
            db: Database connection instance
            
        Returns:
            dict: Success status and message
        """
        collection = db["users"]

        await collection.update_one(
            {"userName": userName},
            {"$pull": {"cardId": cardId
                       }}
        )

        return{
            "message":"Deleted successfully",
            "cardId":cardId
        }
    
    async def getAllUsersCards(self, userName:str, db):
        """
        Retrieves all cards in user's collection
        
        Args:
            userName: Username to fetch cards for
            db: Database connection instance
            
        Returns:
            list: List of card documents
        """
        collection = db["users"]

        cursor = collection.find({"userName":userName},{"cardName":1,"cardId":1})
        result = await cursor.to_list(length = None)
        
        return result
    
    async def BattleCards(self, userName1:str, userName2:str, cardId1: str, cardId2: str, db):
        """
        Handles a card battle between two users
        
        Args:
            userName1: Username of first player
            userName2: Username of second player
            cardId1: Card ID of first player
            cardId2: Card ID of second player
            db: Database connection instance
            
        Returns:
            dict: Battle result and winner information
        """
        collection = db["users"]

        user1CardPower = collection.find_one({
            "userName":userName1,
            "cardId":cardId1
            },
            {"power":1}
        )["power"]
        
        user2CardPower = collection.find_one({
            "userName":userName1,
            "cardId":cardId1
            },
            {"power":1}
        )["power"]

        if user1CardPower > user2CardPower:
            return {
                "user1CardPower":user1CardPower,
                "user2CardPower":user2CardPower,
                "message":"O ma de to! Player 1 won!"
            }
                
        if user1CardPower < user2CardPower:
            return {
                "user1CardPower":user1CardPower,
                "user2CardPower":user2CardPower,
                "message":"O ma de to! Player 2 won!"
            }