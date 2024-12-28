from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import users, auth, messages, tweet
from config.database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(messages.router)
app.include_router(tweet.router)