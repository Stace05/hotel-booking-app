from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

import models
from database import engine, SessionLocal
from pure_fabrication import InformationExpert

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bookit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "success"}

@app.get("/api/rooms")
def get_all_rooms(db: Session = Depends(get_db)):
    controller = InformationExpert(db)
    return controller.get_all_rooms()
@app.get("/api/rooms/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):
    controller = InformationExpert(db)
    room = controller.get_room_by_id(room_id)

    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    return room