from sqlalchemy.orm import Session
from bookings.repository import InformationExpert, BookingInformationExpert, AdminReportsExpert
from bookings.models import Room
from bookings.schemas import RoomCreate
from bookings.booking_facade import BookingFacade
from bookings.booking_state import BookingContext
from auth.models import User

class RoomService:
    @staticmethod
    def get_all(db: Session):
        return InformationExpert(db).get_all_rooms()

    @staticmethod
    def get_by_id(room_id: int, db: Session):
        room = InformationExpert(db).get_room_by_id(room_id)
        if not room:
            raise ValueError("Room not found")
        return room

    @staticmethod
    def create(room_data: RoomCreate, db: Session):
        new_room = Room(
            name=room_data.name, category=room_data.category, beds=room_data.beds,
            price=room_data.price, description=room_data.description,
            amenities=room_data.amenities, image=room_data.image
        )
        InformationExpert(db).create_room(new_room)
        return {"status": "success", "message": "Room added successfully", "room_id": new_room.id}

    @staticmethod
    def delete(room_id: int, db: Session):
        expert = InformationExpert(db)
        room = expert.get_room_by_id(room_id)
        if not room:
            raise ValueError("Room not found")
        expert.delete_room(room)
        return {"status": "success", "message": "Room deleted successfully"}

class BookingProcessingService:
    @staticmethod
    def process_new_booking(request, db: Session):
        facade = BookingFacade(db)
        return facade.process_booking(request)

    @staticmethod
    def cancel_booking(booking_id: int, db: Session):
        expert = BookingInformationExpert(db)
        booking = expert.get_booking_by_id(booking_id)
        if not booking:
            raise ValueError("Booking not found")
        
        context = BookingContext(booking)
        context.cancel() 
        
        if booking.user_id:
            user = db.query(User).filter(User.id == booking.user_id).first()
            if user:
                user.bonus_points = max(0, user.bonus_points - (booking.total_price * 0.05))
        
        expert.delete_booking(booking)
        return {"status": "success", "message": "Booking cancelled"}

    @staticmethod
    def extend_booking(booking_id: int, additional_days: int, db: Session):
        expert = BookingInformationExpert(db)
        booking = expert.get_booking_by_id(booking_id)
        if not booking:
            raise ValueError("Booking not found")
        
        context = BookingContext(booking)
        message = context.extend(additional_days)
        db.commit() 
        return {"status": "success", "message": message, "new_price": booking.total_price}

    @staticmethod
    def get_user_bookings(user_id: int, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        results = BookingInformationExpert(db).get_user_bookings(user_id)
        
        bookings_data = [{
            "id": b.id, "room_name": r_name, "guest_name": b.guest_name,
            "check_in": b.check_in, "check_out": b.check_out,
            "total_price": b.total_price, "status": b.status
        } for b, r_name in results]
        
        return {"bonus_points": user.bonus_points if user else 0, "bookings": bookings_data}

class ReportService:
    @staticmethod
    def get_admin_reports(db: Session):
        expert = AdminReportsExpert(db)
        return {
            "room_stats": [{"name": r[0], "bookings": r[1], "revenue": r[2] or 0} for r in expert.get_room_stats()],
            "monthly_revenue": [{"month": r[0], "revenue": r[1] or 0} for r in expert.get_monthly_revenue()],
            "top_clients": [{"name": c[0], "email": c[1], "bookings_count": c[2], "total_spent": c[3] or 0} for c in expert.get_top_clients()]
        }