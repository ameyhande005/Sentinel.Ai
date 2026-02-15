from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(String, primary_key=True)
    status = Column(String)
    last_activity_days = Column(Integer)
    source = Column(String)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
