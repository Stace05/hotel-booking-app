from abc import ABC, abstractmethod

class PricingStrategy(ABC):
    @abstractmethod
    def calculate_price(self, base_rate: float, nights: int) -> float:
        pass

class StandardPricingStrategy(PricingStrategy):
    def calculate_price(self, base_rate: float, nights: int) -> float:
        return base_rate * nights

class LongStayDiscountStrategy(PricingStrategy):
    def calculate_price(self, base_rate: float, nights: int) -> float:
        total = base_rate * nights
        if nights >= 3:
            print("10% discount applied")
            return total * 0.90
        return total

class PricingContext:
    def __init__(self, strategy: PricingStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: PricingStrategy):
        self._strategy = strategy

    def execute_pricing(self, base_rate: float, nights: int) -> float:
        return self._strategy.calculate_price(base_rate, nights)

def get_pricing_strategy(nights: int) -> PricingStrategy:
    if nights >= 3:
        return LongStayDiscountStrategy()
    return StandardPricingStrategy()