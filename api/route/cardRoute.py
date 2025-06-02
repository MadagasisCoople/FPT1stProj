from fastapi import APIRouter, HTTPException, Depends
from infrastructure.mongoDB import getMongoDB
from repositories.cardRepository import cardRepository
from service.cardService import cardService

router = APIRouter()

cardRepositorys = cardRepository()
cardServices = cardService()

@router.post("/addCard")
async def addCard(userName:str,musicId:str,db=Depends(getMongoDB)):
    await cardServices.addCard(userName,musicId,db)
    return await cardRepositorys.addCard(userName,musicId,db)

@router.get("/removeCard")
async def removeCard(userName:str,cardId:str,db=Depends(getMongoDB)):
    await cardServices.removeCard(userName,cardId,db)
    return await cardRepositorys.removeCard(userName,cardId,db)

@router.get("/getAllUserCards")
async def getAllUserCards(userName:str,db=Depends(getMongoDB)):
    await cardServices.getAllUsersCards(userName,db)
    return await cardRepositorys.getAllUsersCards(userName,db)

@router.get("/battleCard")
async def battleCards(userName1:str, userName2:str, cardId1:str, cardId2:str, db = Depends(getMongoDB)):
    await cardServices.battleCards(userName1,userName2,cardId1,cardId2,db)
    return await cardRepositorys.battleCards(userName1,userName2,cardId1,cardId2,db)

