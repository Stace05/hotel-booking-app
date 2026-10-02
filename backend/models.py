from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="client") 
    bonus_points = Column(Float, default=0.0) 

    bookings = relationship("Booking", back_populates="user")

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    beds = Column(Integer)
    amenities = Column(JSON) 
    description = Column(String)
    price = Column(Integer)
    image = Column(String)
    address = Column(String)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    guest_name = Column(String) 
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(String, default="Confirmed") 
    total_price = Column(Float, default=0.0) 

    user = relationship("User", back_populates="bookings")