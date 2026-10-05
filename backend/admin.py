from database import SessionLocal
import models

db = SessionLocal()

admin_email = "admin@bookit.com" 

user = db.query(models.User).filter(models.User.email == admin_email).first()

if user:
    user.role = "admin"
    db.commit()
    print(f"User {user.name} ({user.email}) is now an administrator.")
else:
    print(f"User with email {admin_email} not found. Please register first.")

db.close()