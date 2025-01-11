from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, field_validator
import torch
from datetime import datetime

from models.chat_message import ChatMessage
from models.user import User
from dependencies.dependency import db_dependency, get_current_user

router = APIRouter(
    prefix="/chat_messages",
    tags=["chat_messages"]
)

MODEL_PATH = "./models/your_trained_model.pt"
model = torch.load(MODEL_PATH)
model.eval()

def preprocess_input(text: str):
    """
    Kullanıcıdan gelen metni model uygun hale getirir.
    """
    tokens = text.lower().split()
    return torch.tensor([len(tokens)])

def postprocess_output(output):
    return "Positive" if output.argmax().item() == 1 else "Negative"




class MessageCreate(BaseModel):
    sender: str # "user" | "bot"
    text: str

    @field_validator("sender")
    def validate_sender(cls, sender):
        if sender not in ["user", "bot"]:
            raise ValueError("Sender must be 'user' or 'bot'")
        return sender
    
    @field_validator("text")
    def validate_text(cls, text):
        if not text.strip():
            raise ValueError("Message text cannot be empty")
        return text.strip()

class MessageOut(BaseModel):
    id: int
    sender: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

# Mesaj Oluşturma Endpoint'i
@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    """
    Kullanıcı için yeni bir mesaj oluşturur.
    """
    new_message = ChatMessage(
        sender=message.sender,
        text=message.text,
        user_id=current_user["id"] 
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)  # Eksik parametre düzeltildi
    return new_message

@router.get("/", response_model=List[MessageOut], status_code=status.HTTP_200_OK)
def get_messages(
    db: db_dependency,
    current_user=Depends(get_current_user),
):
    """
    Kullanıcıya ait tüm mesajları getirir.
    """
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user["id"]).order_by(ChatMessage.created_at.asc()).all()
    if not messages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No messages found for this user."
        )
    return messages