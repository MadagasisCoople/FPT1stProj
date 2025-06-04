# Import required FastAPI modules and custom routers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.route.userNameRoute import router as userRouter
from api.route.musicRoute import router as musicRouter
from api.route.cardRoute import router as cardRouter
from core.lifespan import lifeSpanConnect

# Initialize FastAPI application with custom lifespan handler
print("Starting FastAPI application...")
app = FastAPI(lifespan=lifeSpanConnect)

# Configure CORS middleware to allow cross-origin requests
# This enables the API to be accessed from different domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register API routers for different endpoints
# Each router handles a specific set of related endpoints
app.include_router(userRouter)  # User-related endpoints
app.include_router(musicRouter)  # Music-related endpoints
app.include_router(cardRouter)  # Card-related endpoints