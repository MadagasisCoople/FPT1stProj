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
    await userServices.addUser(username, db)
    return await userRepositorys.addUser(username, password, db)

@router.delete("/deleteAllUsers")
async def deleteAllUsers(username: str, db = Depends(getMongoDB)):
    return await userRepositorys.deleteAllUsers(db)

@router.delete("/deleteUser")
async def deleteUser(username: str, db = Depends(getMongoDB)):
    await userServices.deleteUser(username, db)
    return await userRepositorys.deleteUser(username, db)

@router.get("/numberOfUsers")
async def numberOfUsers(db = Depends(getMongoDB)):
    return await userRepositorys.numberOfUsers(db)

@router.get("/checkingUser")
async def checkingUser(username: str, password: str, db = Depends(getMongoDB)):
    await userServices.checkingUser(username, password, db)
    return await userRepositorys.checkingUser(username, password, db)

@router.get("/getUserId")
async def getUserId(username: str, db = Depends(getMongoDB)):
    await userServices.getUserId(username, db)
    return await userRepositorys.getUserId(username, db)