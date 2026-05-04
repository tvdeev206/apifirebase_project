from gemini import ask_gemini

def process_command(text: str):
    text = text.strip()

    # optional command parsing
    if text.startswith("summarize"):
        prompt = f"Summarize this clearly:\n{text}"
        return ask_gemini(prompt)

    if text.startswith("title"):
        prompt = f"Generate a short title:\n{text}"
        return ask_gemini(prompt)

    if text.startswith("todo"):
        prompt = f"Extract a todo list from this:\n{text}"
        return ask_gemini(prompt)

    return ask_gemini(text)