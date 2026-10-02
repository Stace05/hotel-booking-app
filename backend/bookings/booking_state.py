from abc import ABC, abstractmethod
from datetime import timedelta

class BookingState(ABC):
    @abstractmethod
    def cancel(self, context) -> str:
        pass

    @abstractmethod
    def extend(self, context, additional_days: int) -> str:
        pass

class ConfirmedState(BookingState):
    def cancel(self, context) -> str:
        context.booking_model.status = "Cancelled"
        context.set_state(CancelledState())
        return "Booking cancelled."

    def extend(self, context, additional_days: int) -> str:
        context.booking_model.check_out += timedelta(days=additional_days)
        daily_rate = 50.0 
        context.booking_model.total_price += (daily_rate * additional_days)
        return f"Booking extended by {additional_days} days."

class CancelledState(BookingState):
    def cancel(self, context) -> str:
        raise ValueError("Booking is already cancelled.")

    def extend(self, context, additional_days: int) -> str:
        raise ValueError("Cannot extend a cancelled booking.")

class BookingContext:
    def __init__(self, booking_model):
        self.booking_model = booking_model
        if booking_model.status == "Cancelled":
            self._state = CancelledState()
        else:
            self._state = ConfirmedState()

    def set_state(self, state: BookingState):
        self._state = state

    def cancel(self):
        return self._state.cancel(self)

    def extend(self, additional_days: int):
        return self._state.extend(self, additional_days)