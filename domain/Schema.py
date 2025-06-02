from typing import Optional 
from pydantic import BaseModel
print("Schema module initialized")

class Musics(BaseModel):
    userMusic: str
    userMusicId: Optional[int] = None

class userNames(BaseModel):
    userId: int
    userName: str
    passWord: Optional[str]
    userMusic: Optional[list[Musics]] = []

class cardNames(BaseModel):
    cardId: str
    cardName: str
    power: int
    specialPower: Optional[int] 