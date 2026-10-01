from sqlalchemy import Column, Integer, String, JSON
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