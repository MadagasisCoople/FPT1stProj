# Import required modules
from typing import Optional 
from pydantic import BaseModel
print("Schema module initialized")

# Data model for music entries
class Musics(BaseModel):
    userMusic: str          # The music identifier (e.g., YouTube URL/ID)
    userMusicId: Optional[int] = None  # Optional unique identifier for the music

# Data model for user accounts
class userNames(BaseModel):
    userId: int             # Unique identifier for the user
    userName: str           # User's username
    passWord: Optional[str] # User's password (optional for flexibility)
    userMusic: Optional[list[Musics]] = []  # List of user's music entries

# Data model for card game entries
class cardNames(BaseModel):
    cardId: str             # Unique identifier for the card
    cardName: str           # Name of the card
    power: int             # Base power level of the card
    specialPower: Optional[int]  # Optional special power level 