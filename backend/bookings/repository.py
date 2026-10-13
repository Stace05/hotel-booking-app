from sqlalchemy.orm import Session
from sqlalchemy import func
from bookings.models import Room, Booking
from auth.models import User

class InformationExpert:
    def __init__(self, db: Session):
        self.db = db

    def get_all_rooms(self):
        return self.db.query(Room).all()

    def get_room_by_id(self, room_id: int):
        return self.db.query(Room).filter(Room.id == room_id).first()

    def create_room(self, room: Room):
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def delete_room(self, room: Room):
        self.db.query(Booking).filter(Booking.room_id == room.id).delete()
        self.db.delete(room)
        self.db.commit()

class BookingInformationExpert:
    def __init__(self, db: Session):
        self.db = db

    def is_room_available(self, room_id: int, check_in, check_out):
        overlapping = self.db.query(Booking).filter(
            Booking.room_id == room_id,
            Booking.status != "Cancelled",
            Booking.check_in < check_out,
            Booking.check_out > check_in
        ).first()
        return not overlapping

    def create_booking(self, room_id, user_id, guest_name, check_in, check_out, total_price):
        booking = Booking(
            room_id=room_id, user_id=user_id, guest_name=guest_name,
            check_in=check_in, check_out=check_out, total_price=total_price
        )
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        return booking

    def get_booking_by_id(self, booking_id: int):
        return self.db.query(Booking).filter(Booking.id == booking_id).first()

    def delete_booking(self, booking: Booking):
        self.db.delete(booking)
        self.db.commit()

    def get_user_bookings(self, user_id: int):
        return self.db.query(Booking, Room.name).join(
            Room, Booking.room_id == Room.id
        ).filter(Booking.user_id == user_id).all()

class AdminReportsExpert:
    def __init__(self, db: Session):
        self.db = db

    def get_room_stats(self):
        return self.db.query(
            Room.name, 
            func.count(Booking.id).label("total_bookings"),
            func.sum(Booking.total_price).label("total_revenue")
        ).outerjoin(Booking, Booking.room_id == Room.id).group_by(Room.id).all()

    def get_monthly_revenue(self):
        return self.db.query(
            func.strftime('%Y-%m', Booking.check_in).label("month"),
            func.sum(Booking.total_price).label("revenue")
        ).filter(Booking.status != "Cancelled").group_by("month").all()
        
    def get_top_clients(self):
        return self.db.query(
            User.name, User.email,
            func.count(Booking.id).label("bookings_count"),
            func.sum(Booking.total_price).label("total_spent")
        ).join(Booking).filter(Booking.status != "Cancelled") \
         .group_by(User.id).order_by(func.count(Booking.id).desc()).limit(5).all()