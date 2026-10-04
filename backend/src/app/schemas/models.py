from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TypingTest(BaseModel):
    user_id: int
    mode: Literal["time", "words"]
    selected_limit: int
    wpm: float
    accuracy: float
    correct_characters: int
    incorrect_characters: int
    total_characters: int
    elapsed_time: int

class Text(BaseModel):
    content: str
    total_characters: int