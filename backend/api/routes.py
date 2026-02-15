from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "project_health": "ON_TRACK",
        "message": "API is working correctly"
    }

@router.post("/analyze")
def analyze_project():
    return {
        "project_health": "AT_RISK",
        "blocked_tasks": 2,
        "summary": "Two tasks are blocked due to pending approvals"
    }
