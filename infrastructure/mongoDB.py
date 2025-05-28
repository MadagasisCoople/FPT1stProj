from motor.motor_asyncio import AsyncIOMotorClient

class mongoDB:
    client: AsyncIOMotorClient
    db = None

    @classmethod
    async def connectMongo(cls) -> None:
        cls.client = AsyncIOMotorClient("mongodb://localhost:27017")
        cls.db = cls.client["fpt"]

    @classmethod
    async def closeMongo(cls) -> None:
        cls.client.close()

    @classmethod
    async def createCollection(cls, collection_name: str) -> None:
        if cls.db is not None:
            await cls.db.create_collection(collection_name)
        else:
            raise ValueError("Database connection is not established.")
        
def getMongoDB(request):
    if request.app.state.db is None:
        raise ValueError("Database connection is not established.")
    return request.app.state.db