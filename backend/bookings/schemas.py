from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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

class RoomCreate(BaseModel):
    name: str
    category: str          
    beds: int      
    price: float
    description: str
    amenities: str    
    image: str = "room1.jpg"