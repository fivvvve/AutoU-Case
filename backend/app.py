from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (
    classify_email
)

origins = [
    "http://localhost:5173",
]

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