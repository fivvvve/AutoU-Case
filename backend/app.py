from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routes import (
    classify_email
)

load_dotenv()

origins = os.environ.get("ALLOWED_ORIGINS").split(",") if os.environ.get("ALLOWED_ORIGINS") else ""

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.include_router(classify_email.router)

@app.get("/")
def read_root():
    return {"message": "Vercel Server"}