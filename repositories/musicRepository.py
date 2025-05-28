from infrastructure.mongoDB import getMongoDB
from domain.Schema import Musics, userNames
from googleapiclient.discovery import build
print("Music repository initialized")

class musicRepository:
    
    async def addMusic(self, username: str, userMusic: str, db):
        youtube = build("youtube", "v3", developerKey="put your own")

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

        db.update_one(
        {"userName": username},
        {"$push": {"userMusic": newMusic}})

        return {
        "userMusic": userMusic,
        "musicId": response["items"][0]["id"]["videoId"]
    }

    async def getAllUserMusic(self, username: str, db):
        return list(db.find({"userName": username}, {"_id": 0, "userMusic": 1}))

    async def deleteMusic(self, username: str, userMusic: str, db):
        db.update_one(
            {"userName": username},
            {"$pull": {"userMusic": {"userMusic": {
                "$regex": userMusic, "$options": "i"  # Case-insensitive match
            }}}}
        )
        return {"message": "Music deleted successfully"}
