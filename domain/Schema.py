from typing import Optional 
from pydantic import BaseModel
print("Schema module initialized")

class Musics(BaseModel):
    userMusic: str
    userMusicID: Optional[int] = None

class userNames(BaseModel):
    userId: int
    userName: str
    passWord: Optional[str]
    userMusic: Optional[list[Musics]] = []

    