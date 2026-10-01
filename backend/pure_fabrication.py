from sqlalchemy.orm import Session
import models

class InformationExpert:
    def __init__(self, db: Session):
        self.db = db

    def get_all_rooms(self):
        return self.db.query(models.Room).all()

    def get_room_by_id(self, room_id: int):
        return self.db.query(models.Room).filter(models.Room.id == room_id).first()