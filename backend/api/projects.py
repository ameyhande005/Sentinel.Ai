from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from dependencies import get_current_user
from models.project import Project
from models.team_member import TeamMember

router = APIRouter(prefix="/projects", tags=["Projects"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# CREATE PROJECT
# -------------------------
@router.post("/")
def create_project(
    payload: dict,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    project = Project(
        name=payload["name"],
        description=payload.get("description"),
        priority=payload.get("priority", "medium"),
        owner_id=user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    for member in payload.get("team", []):
        tm = TeamMember(
            project_id=project.id,
            name=member["name"],
            email=member.get("email"),
            role=member.get("role")
        )
        db.add(tm)

    db.commit()

    return {"project_id": str(project.id)}


# -------------------------
# LIST PROJECTS
# -------------------------
@router.get("/")
def list_projects(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(Project).filter(Project.owner_id == user.id).all()
