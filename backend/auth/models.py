from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="client") 
    bonus_points = Column(Float, default=0.0) 

    bookings = relationship("Booking", back_populates="user")