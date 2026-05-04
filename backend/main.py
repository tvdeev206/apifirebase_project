from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from model import process_command

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RenoRequest(BaseModel):
    text: str


class LoginRequest(BaseModel):
    email: str
    password: str



fake_user = {
    "email": "test@reno.com",
    "password": "123456",
    "id": "user_001"
}

current_user = None


@app.get("/")
def home():
    return {
        "message": "ReNO API running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }



@app.post("/auth/login")
def login(req: LoginRequest):
    global current_user

    if req.email == fake_user["email"] and req.password == fake_user["password"]:
        current_user = fake_user
        return {
            "message": "Login successful",
            "user": current_user
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.get("/auth/me")
def me():
    if not current_user:
        raise HTTPException(status_code=401, detail="Not logged in")

    return current_user


@app.post("/reno")
def run_reno(req: RenoRequest):
    result = process_command(req.text)
    return {
        "input": req.text,
        "result": result
    }


@app.get("/notes")
def get_notes():
    # later: replace with Firestore
    return [
        {"id": 1, "title": "Welcome", "content": "This is your first note"},
        {"id": 2, "title": "ReNO", "content": "AI-powered notes system"}
    ]