# User Route Module
# Handles all user-related API endpoints including:
# - User registration
# - User authentication
# - User management

from fastapi import APIRouter, Depends
from infrastructure.mongoDB import getMongoDB
from repositories.userRepository import userRepository
from service.userService import userService
print("User route initialized")
router = APIRouter()

userRepositorys = userRepository()
userServices = userService()

@router.post("/addUser")
async def add_user(username: str, password: str, db = Depends(getMongoDB)):
    """
    Register a new user
    
    Args:
        username: New user's username
        password: New user's password
        
    Returns:
        dict: Success status and user details
    """
    await userServices.addUser(username, db)
    return await userRepositorys.addUser(username, password, db)

@router.delete("/deleteAllUsers")
async def deleteAllUsers(db = Depends(getMongoDB)):
    """
    Delete all users from the database
    
    Returns:
        dict: Success status and count of deleted users
    """
    return await userRepositorys.deleteAllUsers(db)

@router.delete("/deleteUser")
async def deleteUser(username: str, db = Depends(getMongoDB)):
    """
    Delete a specific user by username
    
    Args:
        username: Username of the user to delete
        
    Returns:
        dict: Success status and deleted user details
    """
    await userServices.deleteUser(username, db)
    return await userRepositorys.deleteUser(username, db)

@router.get("/numberOfUsers")
async def getNumberOfUsers(db = Depends(getMongoDB)):
    """
    Get total number of registered users
    
    Returns:
        dict: Count of registered users
    """
    return await userRepositorys.numberOfUsers(db)

@router.get("/checkingUser")
async def checkUser(username: str, password: str, db = Depends(getMongoDB)):
    """
    Authenticate a user
    
    Args:
        username: User's username
        password: User's password
        
    Returns:
        dict: Success status and user details if authenticated
    """
    await userServices.checkingUser(username, password, db)
    return await userRepositorys.checkingUser(username, password, db)

@router.get("/getUserId")
async def getUserId(username: str, db = Depends(getMongoDB)):
    """
    Get user ID by username
    
    Args:
        username: Username to look up
        
    Returns:
        dict: User ID if found
    """
    await userServices.getUserId(username, db)
    return await userRepositorys.getUserId(username, db)