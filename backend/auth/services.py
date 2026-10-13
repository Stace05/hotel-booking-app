from sqlalchemy.orm import Session
from auth.schemas import UserRegister, UserLogin
from auth.repository import UserRepository
from auth.user_factory import UserFactory
from core.security import verify_password, create_access_token

class AuthService:
    @staticmethod
    def register_user(request: UserRegister, db: Session):
        existing_user = UserRepository.get_user_by_email(db, request.email)
        if existing_user:
            raise ValueError("Email is already registered")

        new_user = UserFactory.create_user(request.name, request.email, request.password)
        UserRepository.save_user(db, new_user)
        
        return {"status": "success", "message": "Account created successfully"}

    @staticmethod
    def authenticate_user(request: UserLogin, db: Session):
        user = UserRepository.get_user_by_email(db, request.email)
        
        if not user or not verify_password(request.password, user.hashed_password):
            raise ValueError("Invalid email or password")

        token = create_access_token(data={"sub": str(user.id), "role": user.role})
        
        return {
            "access_token": token, 
            "token_type": "bearer",
            "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
        }