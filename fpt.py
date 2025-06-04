# Import required FastAPI modules and custom routers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.route.userNameRoute import router as userRouter  # Router for user authentication and management
from api.route.musicRoute import router as musicRouter    # Router for music collection management
from api.route.cardRoute import router as cardRouter      # Router for card game functionality
from core.lifespan import lifeSpanConnect                 # Custom lifespan handler for database connections

# Initialize FastAPI application with custom lifespan handler
# This ensures proper database connection management during application lifecycle
print("Starting FastAPI application...")
app = FastAPI(lifespan=lifeSpanConnect)

# Configure CORS middleware to allow cross-origin requests
# This enables the frontend to communicate with the API from different domains
# Important for development and production environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin for development
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers for maximum compatibility
)

# Register API routers for different endpoints
# Each router handles a specific set of related endpoints and functionality
app.include_router(userRouter)   # User-related endpoints (login, signup, user management)
app.include_router(musicRouter)  # Music-related endpoints (add, remove, list music)
app.include_router(cardRouter)   # Card-related endpoints (card game functionality)