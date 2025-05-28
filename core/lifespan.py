from contextlib import asynccontextmanager
from infrastructure.mongoDB import mongoDB

@asynccontextmanager
async def lifeSpanConnect(app):
    print("Lifespan connect initialized")
    await mongoDB.connectMongo()
    await mongoDB.createCollection("userNameList")
    app.state.db = mongoDB.db
    yield
    await mongoDB.closeMongo()