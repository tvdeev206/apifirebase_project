import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-3.1-flash-lite-preview")

def ask_gemini(prompt: str):
    response = model.generate_content(prompt)
    return response.text

print("API KEY:", os.getenv("GOOGLE_API_KEY"))