from fastapi import Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models.user import User


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🚨 TEMPORARY AUTH BYPASS (SAFE)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise Exception("No user found in database")
    return user
