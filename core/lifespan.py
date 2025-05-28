from contextlib import asynccontextmanager
from infrastructure.mongoDB import mongoDB

@asynccontextmanager
async def lifeSpanConnect(app):
    await mongoDB.connectMongo()
    await mongoDB.createCollection("userNameList")
    app.state.db = mongoDB.db
    yield
    await mongoDB.closeMongo()