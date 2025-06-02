from motor.motor_asyncio import AsyncIOMotorClient

class mongoDB:
    def __init__(self):
        self.connection_string = "mongodb://localhost:27017"
        self.client = AsyncIOMotorClient(self.connection_string)
        self.db = self.client.userNameSong
        
    def get_db(self):
        return self.db

    @classmethod
    async def connectMongo(cls) -> None:
        cls.client = AsyncIOMotorClient("mongodb://host.docker.internal:27017/")
        cls.db = cls.client["fpt"]

    @classmethod
    async def closeMongo(cls) -> None:
        cls.client.close()

    @classmethod
    async def createCollection(cls, collection_name: str) -> None:
        if cls.db is not None:
            # Check if collection exists before creating it
            collections = await cls.db.list_collection_names()
            if collection_name not in collections:
                await cls.db.create_collection(collection_name)
        else:
            raise ValueError("Database connection is not established.")
        
def getMongoDB():
    if mongoDB.db is None:
        raise ValueError("Database connection is not established.")
    return mongoDB.db