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

