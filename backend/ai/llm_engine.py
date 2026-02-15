import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_project_summary(risks):
    if not risks:
        return "No major project risks detected."

    prompt = f"""
You are an AI project assistant.
Summarize the following project risks clearly.
Do not assume missing information.

Risks:
{chr(10).join(risks)}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    return response.choices[0].message.content
