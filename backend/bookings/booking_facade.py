from sqlalchemy.orm import Session
from datetime import datetime
from pure_fabrication import InformationExpert, BookingInformationExpert
from bookings.pricing_strategy import PricingContext, get_pricing_strategy
from notifications.notifications_observer import BookingEventManager, BonusPointsObserver, EmailNotificationObserver

class BookingFacade:
    def __init__(self, db: Session):
        self.db = db
        self.room_controller = InformationExpert(db)
        self.booking_controller = BookingInformationExpert(db)

    def process_booking(self, request_data) -> dict:
        room_id = request_data.room_id
        check_in = request_data.check_in
        check_out = request_data.check_out
        
        if not self.booking_controller.is_room_available(room_id, check_in, check_out):
            raise ValueError("This room is already booked for the selected dates.")

        room = self.room_controller.get_room_by_id(room_id)
        if not room:
            raise ValueError("Room not found.")

        nights = (check_out - check_in).days
        if nights <= 0:
            raise ValueError("Check-out date must be after check-in date.")

        strategy = get_pricing_strategy(nights)
        pricing_context = PricingContext(strategy)
        base_price = pricing_context.execute_pricing(base_rate=room.price, nights=nights)

        # factory
        # decorator
        
        final_price = base_price 

        booking = self.booking_controller.create_booking(
            room_id=room_id,
            user_id=request_data.user_id,     
            guest_name=request_data.guest_name,
            check_in=check_in,
            check_out=check_out,
            total_price=final_price           
        )

        event_manager = BookingEventManager()
        
        event_manager.attach(BonusPointsObserver(self.db))
        event_manager.attach(EmailNotificationObserver())
        
        event_manager.notify("booking_created", {
            "user_id": request_data.user_id,
            "guest_name": request_data.guest_name,
            "total_price": final_price
        })

        return {
            "status": "success",
            "message": "Room successfully booked",
            "booking_id": booking.id,
            "nights": nights,
            "total_price": final_price
        }