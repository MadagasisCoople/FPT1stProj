from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from googleapiclient.discovery import build
print("Music repository initialized")

class musicRepository:
    
    async def addMusic(self, username: str, userMusic: str, db):
        youtube = build("youtube", "v3", developerKey="AIzaSyD6OVKMBhRTvZ1_RSqanT-aa-M_CmkkACg")

        request = youtube.search().list(
            q=userMusic,
            part="id",
            maxResults=1
        )
        
        response = request.execute()
        newMusic = {
            "userMusic": userMusic,
            "musicId": response["items"][0]["id"]["videoId"],
        }

        collection = db["users"]
        await collection.update_one(
            {"userName": username},
            {"$push": {"userMusic": newMusic}}
        )

        return {
            "userMusic": userMusic,
            "musicId": response["items"][0]["id"]["videoId"]
        }

    async def getAllUserMusic(self, username: str, db):
        collection = db["users"]
        result = collection.find({"userName": username}, {"_id": 0, "userMusic": 1})
        return result

    async def deleteMusic(self, username: str, userMusic: str, db):
        collection = db["users"]
        await collection.update_one(
            {"userName": username},
            {"$pull": {"userMusic": {"userMusic": {
                "$regex": userMusic, "$options": "i"  # Case-insensitive match
            }}}}
        )
        return {"message": "Music deleted successfully"}
