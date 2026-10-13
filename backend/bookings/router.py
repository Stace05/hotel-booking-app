from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from bookings.schemas import RoomCreate, BookingRequest, ExtendRequest
from bookings.services import RoomService, BookingProcessingService, ReportService

router = APIRouter(prefix="/api", tags=["Bookings & Rooms"])

@router.get("/rooms")
def get_all_rooms(db: Session = Depends(get_db)):
    return RoomService.get_all(db)

@router.get("/rooms/{room_id}")
def get_room(room_id: int, db: Session = Depends(get_db)):
    try:
        return RoomService.get_by_id(room_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/rooms")
def create_room(room_data: RoomCreate, db: Session = Depends(get_db)):
    return RoomService.create(room_data, db)

@router.delete("/rooms/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    try:
        return RoomService.delete(room_id, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/bookings")
def book_room(request: BookingRequest, db: Session = Depends(get_db)):
    try:
        return BookingProcessingService.process_new_booking(request, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/users/{user_id}/bookings")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    return BookingProcessingService.get_user_bookings(user_id, db)

@router.put("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    try:
        return BookingProcessingService.cancel_booking(booking_id, db)
    except ValueError as e:
        status = 404 if "not found" in str(e).lower() else 400
        raise HTTPException(status_code=status, detail=str(e))

@router.put("/bookings/{booking_id}/extend")
def extend_booking(booking_id: int, request: ExtendRequest, db: Session = Depends(get_db)):
    try:
        return BookingProcessingService.extend_booking(booking_id, request.additional_days, db)
    except ValueError as e:
        status = 404 if "not found" in str(e).lower() else 400
        raise HTTPException(status_code=status, detail=str(e))

@router.get("/admin/reports")
def get_admin_reports(db: Session = Depends(get_db)):
    return ReportService.get_admin_reports(db)