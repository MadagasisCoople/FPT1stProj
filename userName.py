from typing import Optional 
from pydantic import BaseModel

class userNames(BaseModel):
    userId: int
    userName: str
    passWord: Optional[str]