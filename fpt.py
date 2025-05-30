from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.route.userNameRoute import router as userRouter
from api.route.musicRoute import router as musicRouter
from api.route.cardRoute import router as cardRouter
from core.lifespan import lifeSpanConnect

print("Starting FastAPI application...")
app = FastAPI(lifespan=lifeSpanConnect)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

#register routers
app.include_router(userRouter)
app.include_router(musicRouter)
app.include_router(cardRouter)