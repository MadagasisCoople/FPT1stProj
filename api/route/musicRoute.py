from fastapi import APIRouter, HTTPException, Depends
from infrastructure.mongoDB import getMongoDB
from repositories.musicRepository import musicRepository
from service.musicService import musicService

router = APIRouter()

musicRepositorys = musicRepository()
musicServices = musicService()

@router.post("/addMusic")
async def addMusic(username: str, userMusic: str, db = Depends(getMongoDB)):
    await musicServices.addMusic(username, userMusic, db)
    return await musicRepositorys.addMusic(username, userMusic, db)

@router.get("/getAllUserMusic")
async def getAllUserMusic(username: str, db = Depends(getMongoDB)):
    await musicServices.getAllUserMusic(username, db)
    return await musicRepositorys.getAllUserMusic(username, db)

@router.delete("/deleteMusic")
async def deleteMusic(username: str, userMusic: str, db = Depends(getMongoDB)):
    await musicServices.deleteMusic(username, userMusic, db)
    return await musicRepositorys.deleteMusic(username, userMusic, db)