from abc import ABC, abstractmethod

class BookingService(ABC):
    @abstractmethod
    def get_cost(self) -> float:
        pass

class BaseBooking(BookingService):
    def __init__(self, base_price: float):
        self.base_price = base_price
        
    def get_cost(self) -> float:
        return self.base_price

class ServiceDecorator(BookingService):
    def __init__(self, wrapped_service: BookingService):
        self.wrapped_service = wrapped_service
        
    def get_cost(self) -> float:
        return self.wrapped_service.get_cost()

class MealsDecorator(ServiceDecorator):
    def __init__(self, wrapped_service: BookingService, nights: int):
        super().__init__(wrapped_service)
        self.nights = nights
        self.daily_rate = 30.0

    def get_cost(self) -> float:
        return self.wrapped_service.get_cost() + (self.daily_rate * self.nights)

class TransferDecorator(ServiceDecorator):
    def get_cost(self) -> float:
        return self.wrapped_service.get_cost() + 50.0

class SpaDecorator(ServiceDecorator):
    def get_cost(self) -> float:
        return self.wrapped_service.get_cost() + 100.0