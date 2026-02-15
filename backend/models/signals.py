from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskSignal(BaseModel):
    task_id: str
    title: str
    status: str  # todo | in_progress | blocked | done
    assignee: Optional[str] = None
    due_date: Optional[datetime] = None
    last_activity_days: int
    source: str  # jira | notion | manual

class MessageSignal(BaseModel):
    message_id: str
    text: str
    timestamp: datetime
    source: str  # slack | whatsapp | manual
