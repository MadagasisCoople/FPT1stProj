# Card Repository Module
# Handles all card-related database operations including:
# - Creating cards from YouTube videos
# - Managing user's card collection
# - Card battle system
from domain.Schema import cardNames, userNames, Musics
from infrastructure.mongoDB import mongoDB
from googleapiclient.discovery import build


class cardRepository:

    async def addCard(self, userName: str, musicId: str, db):
        """
        Creates a new card from a YouTube video and adds it to user's collection
        
        Card power calculation:
        - Base power = views/likes ratio
        - Special power = comment count
        - Total power = Base power + Special power
        """

        # Setup YouTube API and fetch video information
        youtube = build("youtube", "v3", developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")
        request = youtube.videos().list(
            id=musicId,
            part="snippet,statistics"
        )

        response = request.execute()

        # Calculate card stats from video metrics
        viewCount = int(response["items"][0]["statistics"]["viewCount"])
        likeCount = int(response["items"][0]["statistics"]["likeCount"])
        # Special power comes from comment count - more engagement = more power
        commentCount = int(response["items"][0]["statistics"]["commentCount"] or 0)
        Power = round(viewCount/likeCount + commentCount,3)  # Power = views per like + comments
        cardName = response["items"][0]["snippet"]["title"]

        # Create new card document with calculated stats
        newCard = {
            "cardId": musicId,
            "cardName": cardName,
            "power": Power,
            "specialPower": commentCount
        }

        # Add card to user's collection in database
        collection = db["users"]
        await collection.update_one(
            {"userName": userName},
            {"$push": {"card": newCard}}
        )

        # Return card details for frontend display
        return {
            "userName": userName,
            "cardName": cardName,
            "power": Power,
            "likeCount": likeCount,
            "specialPower": commentCount
        }

    async def removeCard(self, userName: str, cardId: str, db):
        """
        Removes a specific card from user's collection
        Uses MongoDB $pull operator to remove card matching the cardId
        """
        collection = db["users"]

        await collection.update_one(
            {"userName": userName},
            {"$pull": {"card": {"cardId": cardId}}}
        )

        return{
            "message":"Deleted successfully",
            "cardId":cardId
        }
    
    async def getAllUsersCards(self, userName:str, db):
        """
        Retrieves all cards owned by a specific user
        Returns only necessary card information:
        - Card Name (YouTube video title)
        - Card ID (YouTube video ID)
        - Power Level (calculated from video stats)
        """
        collection = db["users"]

        cursor = collection.find(
            {"userName": userName},
            {"card.cardName": 1, "card.cardId": 1, "card.power": 1, "_id": 0}
        )
        
        result = await cursor.to_list(length = 100)
        
        return result
    
    async def battleCards(self, userName1:str, userName2:str, cardId1: str, cardId2: str, db):
        """
        Card Battle System
        Compares power levels of two cards to determine winner
        
        Battle Logic:
        1. Find power levels of both cards
        2. Higher power level wins
        3. Returns both power levels and winner message
        """
        collection = db["users"]

        # Get first player's card power
        user1Card = await collection.find_one(
            {
                "userName": userName1,
                "card.cardId": cardId1
            },
            {"card.power": 1}
        )

        # Get second player's card power
        user2Card = await collection.find_one(
            {
                "userName": userName2,
                "card.cardId": cardId2
            },
            {"card.power": 1}
        )

        if not user1Card or not user2Card:
            return {"message": "One or both cards not found!"}

        user1CardPower = user1Card["card"][0]["power"]
        user2CardPower = user2Card["card"][0]["power"]

        # Determine winner based on power levels
        if user1CardPower > user2CardPower:
            return {
                "user1CardPower": user1CardPower,
                "user2CardPower": user2CardPower,
                "message": "O ma de to! Player 1 won!"
            }
                
        if user1CardPower < user2CardPower:
            return {
                "user1CardPower": user1CardPower,
                "user2CardPower": user2CardPower,
                "message": "O ma de to! Player 2 won!"
            }