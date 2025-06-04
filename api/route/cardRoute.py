# Card Route Module
# Handles all card game-related API endpoints including:
# - Card collection management
# - Card battles
# - Card statistics

from fastapi import APIRouter, HTTPException, Depends
from infrastructure.mongoDB import getMongoDB
from repositories.cardRepository import cardRepository
from service.cardService import cardService

router = APIRouter()

cardRepositorys = cardRepository()
cardServices = cardService()

print("Card route initialized")

# Endpoint to add a new card to user's collection
@router.post("/addCard")
async def addCard(userName: str, musicId: str, db = Depends(getMongoDB)):
    """
    Add a new card to user's collection
    
    Args:
        userName: Username of the card owner
        musicId: ID of the music to create card from
        
    Returns:
        dict: Success status and card details
    """
    await cardServices.addCard(userName, musicId, db)
    return await cardRepositorys.addCard(userName, musicId, db)

# Endpoint to remove a card from user's collection
@router.get("/removeCard")
async def removeCard(userName: str, cardId: str, db = Depends(getMongoDB)):
    """
    Remove a card from user's collection
    
    Args:
        userName: Username of the card owner
        cardId: ID of the card to remove
        
    Returns:
        dict: Success status and message
    """
    await cardServices.removeCard(userName, cardId, db)
    return await cardRepositorys.removeCard(userName, cardId, db)

# Endpoint to get all cards in user's collection
@router.get("/getAllUserCards")
async def getAllUserCards(userName: str, db = Depends(getMongoDB)):
    """
    Get all cards in user's collection
    
    Args:
        userName: Username to fetch cards for
        
    Returns:
        list: List of card documents
    """
    await cardServices.getAllUsersCards(userName, db)
    return await cardRepositorys.getAllUsersCards(userName, db)

# Endpoint to handle card battles between two users
@router.get("/battleCard")
async def battleCards(userName1: str, userName2: str, cardId1: str, cardId2: str, db = Depends(getMongoDB)):
    """
    Handle a card battle between two users
    
    Args:
        userName1: Username of first player
        userName2: Username of second player
        cardId1: Card ID of first player
        cardId2: Card ID of second player
        
    Returns:
        dict: Battle result and winner information
    """
    await cardServices.battleCards(userName1, userName2, cardId1, cardId2, db)
    return await cardRepositorys.BattleCards(userName1, userName2, cardId1, cardId2, db)

