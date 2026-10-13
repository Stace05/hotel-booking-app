from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from auth.schemas import UserRegister, UserLogin
from auth.services import AuthService

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register")
def register(request: UserRegister, db: Session = Depends(get_db)):
    try:
        return AuthService.register_user(request, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(request: UserLogin, db: Session = Depends(get_db)):
    try:
        return AuthService.authenticate_user(request, db)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))