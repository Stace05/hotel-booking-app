from sqlalchemy.orm import Session
from datetime import datetime
from pure_fabrication import InformationExpert, BookingInformationExpert
from bookings.pricing_strategy import PricingContext, get_pricing_strategy
from notifications.notifications_observer import BookingEventManager, BonusPointsObserver, EmailNotificationObserver
from bookings.room_factory import RoomFactory
from services.services_decorator import BaseBooking, MealsDecorator, TransferDecorator, SpaDecorator

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

        room_policy = RoomFactory.get_policy(room.name)
        benefits = room_policy.get_benefits()

        booking_service = BaseBooking(base_price=base_price)

        if hasattr(request_data, 'extras') and request_data.extras:
            if request_data.extras.meals:
                booking_service = MealsDecorator(booking_service, nights=nights)
            if request_data.extras.transfer:
                booking_service = TransferDecorator(booking_service)
            if request_data.extras.spa:
                booking_service = SpaDecorator(booking_service)
        
        final_price = booking_service.get_cost() 

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
            "total_price": final_price,
            "benefits": benefits 
        }