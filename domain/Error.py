from fastapi import HTTPException

class userNameConflictError(HTTPException):
    def __init__(self, detail: str = "Already got that username."):
        super().__init__(status_code=409, detail=detail)

class songConflictError(HTTPException):
    def __init__(self, detail: str = "Already got that song."):
        super().__init__(status_code=409, detail=detail)

class userNameNotFoundError(HTTPException): 
    def __init__(self, detail: str = "Unable to dig up that username."):
        super().__init__(status_code=404, detail=detail)

class songNotFoundError(HTTPException): 
    def __init__(self, detail: str = "Unable to dig up that song."):
        super().__init__(status_code=404, detail=detail)