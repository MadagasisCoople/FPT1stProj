# User Service Module
# Handles user-related business logic and validation
import infrastructure.mongoDB as mongoDB
from domain.Schema import userNames, Musics
from domain.Error import userNameConflictError, songConflictError, userNameNotFoundError, songNotFoundError
print("User service initialized")

class userService:
    """
    Service class for handling user-related operations
    Provides validation and business logic for user management
    """
    
    async def addUser(self,username:str, db):
        """
        Validate user creation request
        
        Args:
            username: Username to validate
            db: Database connection instance
            
        Raises:
            userNameConflictError: If username already exists
        """
        collection = db["users"]  # Specify the collection name
        user = await collection.find_one({"userName": username})
        if user: # Check if the username already exists
            raise userNameConflictError()
        
    async def deleteUser(self,username:str, db):
        """
        Validate user deletion request
        
        Args:
            username: Username to validate
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
        """
        collection = db["users"]  # Specify the collection name
        user = await collection.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()
        
    async def checkingUser(self,username:str,password:str, db):
        """
        Validate user credentials
        
        Args:
            username: Username to validate
            password: Password to validate
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username/password combination is invalid
        """
        collection = db["users"]  # Specify the collection name
        user = await collection.find_one({"userName": username, "passWord": password})
        if not user:
            raise userNameNotFoundError()
    
    async def getUserId(self,username: str, db):
        """
        Validate user ID retrieval request
        
        Args:
            username: Username to validate
            db: Database connection instance
            
        Raises:
            userNameNotFoundError: If username doesn't exist
        """
        collection = db["users"]  # Specify the collection name
        user = await collection.find_one({"userName": username})
        if not user:
            raise userNameNotFoundError()