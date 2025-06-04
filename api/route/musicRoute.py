# Music Route Module
# Handles all music-related API endpoints including:
# - Music collection management
# - Music recommendations
# - Music selection

from fastapi import APIRouter, HTTPException, Depends
from infrastructure.mongoDB import getMongoDB
from repositories.musicRepository import musicRepository
from service.musicService import musicService
from service.recommendService import recommendService
print("Music route initialized")

router = APIRouter()

musicRepositorys = musicRepository()
musicServices = musicService()
recommendServices = recommendService()

@router.post("/addMusic")
async def addMusic(username: str, music: str, db = Depends(getMongoDB)):
    """
    Add a new music to user's collection
    
    Args:
        username: Username of the user
        music: Music identifier to add
        
    Returns:
        dict: Success status and music details
    """
    await musicServices.addMusic(username, music, db)
    return await musicRepositorys.addMusic(username, music, db)

@router.get("/getAllUserMusic")
async def getAllUserMusic(username: str, db = Depends(getMongoDB)):
    """
    Get all music in user's collection
    
    Args:
        username: Username to fetch music for
        
    Returns:
        list: List of music documents
    """
    await musicServices.getAllUserMusic(username, db)
    return await musicRepositorys.getAllUserMusic(username, db)

@router.delete("/deleteMusic")
async def deleteMusic(username: str, music: str, db = Depends(getMongoDB)):
    """
    Remove a music from user's collection
    
    Args:
        username: Username of the user
        music: Music identifier to remove
        
    Returns:
        dict: Success status and message
    """
    await musicServices.deleteMusic(username, music, db)
    return await musicRepositorys.deleteMusic(username, music, db)

@router.post("/aiSuggestMusic")
async def aiSuggestMusic(query: str):
    return await recommendServices.aiSuggestMusic(query)

@router.post("/aiPickMusic")
async def aiPickMusic(username: str, query: str, db = Depends(getMongoDB)):
    await musicServices.getAllUserMusic(username,db)
    return await recommendServices.aiPickMusic(username,query,db)