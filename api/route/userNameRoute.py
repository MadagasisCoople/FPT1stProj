from fastapi import APIRouter, Depends
from infrastructure.mongoDB import mongoDB
from repositories.userRepository import userRepository
from repositories.musicRepository import musicRepository

router = APIRouter()

userService = userRepository()

musicService = musicRepository()