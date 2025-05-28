from contextlib import asynccontextmanager
from infrastructure.mongoDB import mongoDB

@asynccontextmanager
async def lifespanConnect(app):
    await mongoDB.connectMongo()
    yield
    await mongoDB.closeMongo()