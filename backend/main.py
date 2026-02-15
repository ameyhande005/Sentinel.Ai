from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine, SessionLocal
from models.user import User
from models.project import Project
from models.team_member import TeamMember

from auth_utils import hash_password, verify_password
from jwt_utils import create_access_token
from dependencies import get_current_user

from api.projects import router as project_router


# -------------------------
# APP INIT (FIRST)
# -------------------------
app = FastAPI()


# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# DATABASE
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create tables
User.metadata.create_all(bind=engine)
Project.metadata.create_all(bind=engine)
TeamMember.metadata.create_all(bind=engine)


# -------------------------
# ROUTERS (AFTER app EXISTS)
# -------------------------
app.include_router(project_router)


# -------------------------
# SCHEMAS
# -------------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# -------------------------
# ROUTES
# -------------------------
@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}


@app.post("/auth/register")
def register_user(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered", "user_id": str(user.id)}


@app.post("/auth/login")
def login_user(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_access_token({"user_id": str(user.id)})

    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
    }
