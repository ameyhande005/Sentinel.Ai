def calculate_risks(tasks, messages):
    risks = []

    for task in tasks:
        if task.get("status") == "blocked":
            risks.append(f"Task {task.get('task_id')} is blocked")

        if task.get("last_activity_days", 0) > 3:
            risks.append(f"Task {task.get('task_id')} has no recent updates")

    for msg in messages:
        if "waiting" in msg.get("text", "").lower():
            risks.append("Dependency waiting mentioned in communication")

    return risks
