import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_summary(risk_items):
    if not risk_items:
        return "No major risks detected."

    content = "\n".join(
        f"- Task {r['task_id']}: {', '.join(r['reasons'])}"
        for r in risk_items
    )

    prompt = f"""
You are an AI project assistant.
Summarize the following project risks clearly.
Do not add assumptions.

Risks:
{content}
"""

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return response.choices[0].message.content
