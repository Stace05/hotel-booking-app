from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime
from database import Base

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

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id")) 
    guest_name = Column(String) 
    check_in = Column(DateTime)
    check_out = Column(DateTime)