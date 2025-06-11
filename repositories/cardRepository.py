from domain.Schema import cardNames, userNames, Musics
from infrastructure.mongoDB import mongoDB
from googleapiclient.discovery import build


class cardRepository:

    async def addCard(self, userName: str, musicId: str, db):

        # setup youtube and search song
        youtube = build("youtube", "v3", developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")
        request = youtube.videos().list(
            id=musicId,
            part="snippet,statistics"
        )

        response = request.execute()

        # Data getting for card
        viewCount = response["items"][0]["statistics"]["viewCount"]
        likeCount = response["items"][0]["statistics"]["likeCount"]
        # speical power adding to commentcount
        commentCount = response["items"][0]["statistics"]["commentCount"] or 0
        Power = round(int(viewCount)/int(likeCount) + int(commentCount),2)  # Power = average person/like
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
    
    async def BattleCards(self, userName1:str, userName2:str, cardId1: int, cardId2: int, db):

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