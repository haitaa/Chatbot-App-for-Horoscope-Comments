from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from dependencies.dependency import db_dependency, get_current_user
from models.chat_message import ChatMessage
from models.user import User
from datetime import datetime

router = APIRouter(
    prefix="/chat_messages",
    tags=["chat_messages"]
)


class MessageCreate(BaseModel):
    sender: str # "user" | "bot"
    text: str

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