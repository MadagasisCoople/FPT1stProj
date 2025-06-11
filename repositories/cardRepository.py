from domain.Schema import cardNames, userNames, Musics
from infrastructure.mongoDB import mongoDB
from googleapiclient.discovery import build
import math


class cardRepository:

    async def addCard(self, userName: str, musicId: str, db):

        # setup youtube and search song
        youtube = build("youtube", "v3",
                        developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")
        request = youtube.videos().list(
            id=musicId,
            part="snippet,statistics"
        )

        response = request.execute()

        # Data getting for card
        viewCount = int(response["items"][0]["statistics"]["viewCount"])
        likeCount = int(response["items"][0]["statistics"]["likeCount"])
        # speical power adding to commentcount
        commentCount = int(response["items"][0]["statistics"]["commentCount"] or 0)

        if viewCount < 1000:
            return 0

        if commentCount <= 10000:
            commentScore = commentCount
        else:
            commentScore = 10000 + (commentCount - 10000) ** 0.5  # or use other smooth formulas above

        maxViewReward = 10000
        viewReward = min(math.log10(viewCount + 1) * 2000, maxViewReward)    
        Power = round(likeCount/viewCount * 1000000 + commentScore + viewReward,2)

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
            "viewCount" : viewCount,
            "likeCount": likeCount,
            "specialPower": commentCount
        }

    async def removeCard(self, userName: str, cardId: str, db):
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
        collection = db["users"]
        cursor = collection.find(
            {"userName": userName},
            {"card": 1, "_id": 0}
        )
        result = await cursor.to_list(length = None)
        return result
    
    async def BattleCards(self, userName1:str, userName2:str, cardId1: str, cardId2: str, db):

        collection =  db["users"]

        user1CardRawPower = await collection.find_one({
            "userName":userName1,
            "card.cardId": cardId1
            },{"card.$":1}
        )
        
        user2CardRawPower = await collection.find_one({
            "userName":userName2,
            "card.cardId": cardId2
            },{"card.$":1}
        )

        user1CardPower = user1CardRawPower["card"][0]["power"]
        user2CardPower = user2CardRawPower["card"][0]["power"]

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
        
        else:
            return { "message": "What a pity~~ A draw"}