from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.database import engine, Base
from auth.models import User
from bookings.models import Room, Booking

from auth.router import router as auth_router
from bookings.router import router as bookings_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bookit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/api/health")
def health_check():
    return {"status": "success"}

app.include_router(auth_router)
app.include_router(bookings_router)