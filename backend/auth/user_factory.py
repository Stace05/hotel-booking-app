from auth.models import User
from core.security import get_password_hash

class UserFactory:
    @staticmethod
    def create_user(name: str, email: str, password: str, role: str = "client") -> User:
        hashed_password = get_password_hash(password)
        
        return User(
            name=name,
            email=email,
            hashed_password=hashed_password,
            role=role,
            bonus_points=0.0
        )