from abc import ABC, abstractmethod

class RoomPolicy(ABC):
    @abstractmethod
    def get_benefits(self) -> list:
        pass

class StandardPolicy(RoomPolicy):
    def get_benefits(self) -> list:
        return ["Free cancellation up to 24 hours before check-in", "Standard amenities included"]

class LuxuryPolicy(RoomPolicy):
    def get_benefits(self) -> list:
        return [
            "Free cancellation at any time", 
            "Late checkout (until 16:00)", 
            "Free bottle of champagne"
        ]

class RoomFactory:
    @staticmethod
    def get_policy(room_name: str) -> RoomPolicy:
        if "Luxury" in room_name:
            return LuxuryPolicy()
        return StandardPolicy()