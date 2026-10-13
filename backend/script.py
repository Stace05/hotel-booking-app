from core.database import SessionLocal, engine, Base
from auth.models import User
from bookings.models import Room
import bcrypt  

Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    admin_email = "admin@bookit.com"
    if not db.query(User).filter(User.email == admin_email).first():
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw("123456".encode('utf-8'), salt).decode('utf-8')
        
        admin_user = User(
            name="Admin",
            email=admin_email,
            hashed_password=hashed_pw, 
            role="admin" 
        )
        db.add(admin_user)
        print("Admin user created successfully!")
    else:
        print("Admin user already exists.")

    if db.query(Room).count() > 0:
        print("Database already has rooms")
        db.commit() 
        db.close()
        return

    rooms_data = [
        {
            "name": "Luxury Suite",
            "category": "Luxury",
            "beds": 2,
            "amenities": ["Wi-Fi", "Mini-bar", "Patio", "TV", "Air Conditioning"],
            "description": "Large room with a view.",
            "price": 150,
            "image": "http://localhost:8000/images/room1.jpg"
        },
        {
            "name": "Standard Double Room",
            "category": "Standard",
            "beds": 2,
            "amenities": ["Wi-Fi", "TV", "Air Conditioning"],
            "description": "Standard room for two.",
            "price": 100,
            "image": "http://localhost:8000/images/room2.jpg"
        },
        {
            "name": "Single Room",
            "category": "Economy",
            "beds": 1,
            "amenities": ["Wi-Fi", "Air Conditioning"],
            "description": "Budget option for a single person.",
            "price": 80,
            "image": "http://localhost:8000/images/room3.jpg"
        },
        {
            "name": "Family Suite",
            "category": "Standard",
            "beds": 4,
            "amenities": ["Wi-Fi", "TV", "Air Conditioning", "Mini-bar"],
            "description": "Large room for a family of four.",
            "price": 120,
            "image": "http://localhost:8000/images/room4.jpg"
        }
    ]
    
    for data in rooms_data:
        room = Room(**data)
        db.add(room)
    
    db.commit()
    print("The rooms were added successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()