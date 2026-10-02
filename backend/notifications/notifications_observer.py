from abc import ABC, abstractmethod
from sqlalchemy.orm import Session
import models

class BookingObserver(ABC):
    @abstractmethod
    def update(self, event_type: str, data: dict):
        pass

class BonusPointsObserver(BookingObserver):
    def __init__(self, db: Session):
        self.db = db

    def update(self, event_type: str, data: dict):
        if event_type == "booking_created" and data.get("user_id"):
            user = self.db.query(models.User).filter(models.User.id == data["user_id"]).first()
            if user:
                bonus = data["total_price"] * 0.05
                user.bonus_points += bonus
                self.db.commit()
                print(f"[Observer] {bonus:.2f} bonuses have been credited for client {user.name}")

class EmailNotificationObserver(BookingObserver):
    def update(self, event_type: str, data: dict):
        if event_type == "booking_created":
            guest = data.get("guest_name", "Guest")
            price = data.get("total_price", 0)
            print(f"[Observer] Dear {guest}, your reservation for ${price:.2f} has been confirmed.")

class BookingEventManager:
    def __init__(self):
        self._observers = []

    def attach(self, observer: BookingObserver):
        self._observers.append(observer)

    def notify(self, event_type: str, data: dict):
        for observer in self._observers:
            observer.update(event_type, data)