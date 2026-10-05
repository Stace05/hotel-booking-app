from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from auth.security import verify_password, create_access_token
from auth.user_factory import UserFactory
from datetime import datetime
from typing import Optional
import models
from database import engine, SessionLocal
from pure_fabrication import InformationExpert, BookingInformationExpert
from bookings.booking_facade import BookingFacade
from bookings.booking_state import BookingContext 

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

class ExtendRequest(BaseModel):
    additional_days: int
    
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
        return facade.process_booking(request)
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
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }

@app.get("/api/users/{user_id}/bookings")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    results = db.query(models.Booking, models.Room.name).join(
        models.Room, models.Booking.room_id == models.Room.id
    ).filter(models.Booking.user_id == user_id).all()
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    bookings_data = []
    for booking, room_name in results:
        bookings_data.append({
            "id": booking.id,
            "room_name": room_name,
            "guest_name": booking.guest_name,
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "total_price": booking.total_price,
            "status": booking.status
        })
    
    return {"bonus_points": user.bonus_points if user else 0, "bookings": bookings_data}

@app.put("/api/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    try:
        context = BookingContext(booking)
        context.cancel() 
        
        if booking.user_id:
            user = db.query(models.User).filter(models.User.id == booking.user_id).first()
            if user:
                bonus_to_remove = booking.total_price * 0.05
                user.bonus_points -= bonus_to_remove
                if user.bonus_points < 0:
                    user.bonus_points = 0 
        db.delete(booking)
        db.commit()
        
        return {"status": "success", "message": "Booking calcelled"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/bookings/{booking_id}/extend")
def extend_booking(booking_id: int, request: ExtendRequest, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    try:
        context = BookingContext(booking)
        message = context.extend(request.additional_days)
        db.commit()
        return {"status": "success", "message": message, "new_price": booking.total_price}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/admin/reports")
def get_admin_reports(db: Session = Depends(get_db)):
    room_stats = db.query(
        models.Room.name, 
        func.count(models.Booking.id).label("total_bookings"),
        func.sum(models.Booking.total_price).label("total_revenue")
    ).outerjoin(models.Booking, models.Booking.room_id == models.Room.id).group_by(models.Room.id).all()

    monthly_revenue = db.query(
        func.strftime('%Y-%m', models.Booking.check_in).label("month"),
        func.sum(models.Booking.total_price).label("revenue")
    ).filter(models.Booking.status != "Cancelled").group_by("month").all()
    
    top_clients = db.query(
        models.User.name,
        models.User.email,
        func.count(models.Booking.id).label("bookings_count"),
        func.sum(models.Booking.total_price).label("total_spent")
    ).join(models.Booking).filter(models.Booking.status != "Cancelled") \
     .group_by(models.User.id).order_by(func.count(models.Booking.id).desc()).limit(5).all()

    return {
        "room_stats": [{"name": r[0], "bookings": r[1], "revenue": r[2] or 0} for r in room_stats],
        "monthly_revenue": [{"month": r[0], "revenue": r[1] or 0} for r in monthly_revenue],
        "top_clients": [{"name": c[0], "email": c[1], "bookings_count": c[2], "total_spent": c[3] or 0} for c in top_clients]
    }