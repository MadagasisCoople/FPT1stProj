from typing import Any, Dict
from typing_extensions import Annotated, Doc
from fastapi import HTTPException
print("Error module initialized")

# Custom error class for application-specific errors
class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

# Error handler for application errors
def handle_app_error(error: AppError) -> HTTPException:
    """
    Converts AppError to FastAPI HTTPException
    
    Args:
        error: The application error to handle
        
    Returns:
        HTTPException: FastAPI compatible error response
    """
    return HTTPException(
        status_code=error.status_code,
        detail=error.message
    )

# Error handler for general exceptions
def handle_general_error(error: Exception) -> HTTPException:
    """
    Handles unexpected exceptions by converting to HTTPException
    
    Args:
        error: The unexpected exception to handle
        
    Returns:
        HTTPException: FastAPI compatible error response
    """
    return HTTPException(
        status_code=500,
        detail=str(error)
    )

# Error class for username conflicts (409 Conflict)
# Used when attempting to create a user with an existing username
class userNameConflictError(HTTPException):
    def __init__(self, detail: str = "Already got that username."):
        super().__init__(status_code=409, detail=detail)

# Error class for song conflicts (409 Conflict)
# Used when attempting to add a song that already exists in the collection
class songConflictError(HTTPException):
    def __init__(self, detail: str = "Already got that song."):
        super().__init__(status_code=409, detail=detail)

# Error class for username not found (404 Not Found)
# Used when attempting to access a non-existent user
class userNameNotFoundError(HTTPException): 
    def __init__(self, detail: str = "Unable to dig up that username."):
        super().__init__(status_code=404, detail=detail)

# Error class for song not found (404 Not Found)
# Used when attempting to access a non-existent song
class songNotFoundError(HTTPException): 
    def __init__(self, detail: str = "Unable to dig up that song."):
        super().__init__(status_code=404, detail=detail)

# Error class for card name conflicts (409 Conflict)
# Used when attempting to create a card with an existing name
class cardNameConflictError(HTTPException):
    def __init__(self, detail: str = "Already got that card name!"):
        super().__init__(status_code=409, detail=detail)

# Error class for card name not found (404 Not Found)
# Used when attempting to access a non-existent card
class cardNameNotFoundError(HTTPException):
    def __init__(self, detail: str = "Unable to dig up that card name!") -> None:
        super().__init__(status_code=404, detail=detail)