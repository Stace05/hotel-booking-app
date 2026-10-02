from sqlalchemy.orm import Session
from datetime import datetime
import models

class InformationExpert:
    def __init__(self, db: Session):
        self.db = db

    def get_all_rooms(self):
        return self.db.query(models.Room).all()

    def get_room_by_id(self, room_id: int):
        return self.db.query(models.Room).filter(models.Room.id == room_id).first()

class BookingInformationExpert:
    def __init__(self, db: Session):
        self.db = db

    def is_room_available(self, room_id: int, check_in: datetime, check_out: datetime):
        overlapping_booking = self.db.query(models.Booking).filter(
            models.Booking.room_id == room_id,
            models.Booking.check_in < check_out,
            models.Booking.check_out > check_in
        ).first()
        
        return overlapping_booking is None

    def create_booking(self, room_id: int, guest_name: str, check_in: datetime, check_out: datetime, user_id: int = None, total_price: float = 0.0):
        new_booking = models.Booking(
            room_id=room_id,
            user_id=user_id,             
            guest_name=guest_name,
            check_in=check_in,
            check_out=check_out,
            total_price=total_price      
        )
        self.db.add(new_booking)
        self.db.commit()
        return new_booking