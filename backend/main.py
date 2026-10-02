from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from auth.security import verify_password, create_access_token
from auth.user_factory import UserFactory
from datetime import datetime
from typing import Optional
import models
from database import engine, SessionLocal
from pure_fabrication import InformationExpert, BookingInformationExpert
from bookings.booking_facade import BookingFacade


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

class Extras(BaseModel):
    meals: bool = False
    transfer: bool = False
    spa: bool = False
    
class BookingRequest(BaseModel):
    room_id: int
    user_id: Optional[int] = None
    guest_name: str
    check_in: datetime
    check_out: datetime
    extras: Optional[Extras] = None
    
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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

@app.post("/api/bookings")
def book_room(request: BookingRequest, db: Session = Depends(get_db)):
    facade = BookingFacade(db)
    
    try:
        result = facade.process_booking(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        

@app.post("/api/auth/register")
def register(request: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    new_user = UserFactory.create_user(request.name, request.email, request.password)
    
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "Account created successfully"}

@app.post("/api/auth/login")
def login(request: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }