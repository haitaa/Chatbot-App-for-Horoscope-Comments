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
    Kullanıcıdan gelen metni modelin kabul edebileceği bir formata dönüştürür.
    
    İşlem Adımları:
    1. Metni küçük harflere çevirir.
    2. Metni kelimelerine ayırır (tokenize eder).
    3. Kelime sayısını bir tensör olarak döndürür.

    Parametreler:
    - text (str): Kullanıcıdan gelen metin.

    Dönen Değer:
    - torch.Tensor: Metnin uzunluğunu içeren bir PyTorch tensörü.
    """
    tokens = text.lower().split()
    return torch.tensor([len(tokens)])

def postprocess_output(output):
    """
    Modelden dönen çıktıyı anlamlı bir metne dönüştürür.
    
    İşlem Adımları:
    1. Model çıktısındaki en yüksek olasılığa sahip sınıfı seçer.
    2. Sınıfa göre 'Positive' (Olumlu) veya 'Negative' (Olumsuz) döner.

    Parametreler:
    - output: Modelden dönen PyTorch tensörü.

    Dönen Değer:
    - str: Tahmin edilen sınıf etiketi ('Positive' veya 'Negative').
    """
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

@router.post("/reply", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def reply_message(
    message: MessageCreate,
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    """
    Kullanıcıdan alınan bir mesajı işleyip modele iletir ve modelin cevabını kaydederek döndürür.

    İşlem Adımları:
    1. Kullanıcı mesajını veritabanına kaydeder (`create_message` çağrısı).
    2. Mesaj metnini modelin anlayacağı şekilde ön işler (`preprocess_input`).
    3. Model çıktısını alır ve anlamlı bir yanıta dönüştürür (`postprocess_output`).
    4. Modelin yanıtını "bot" tarafından gönderilmiş bir mesaj olarak veritabanına kaydeder.
    5. Bot mesajını döndürür.

    Parametreler:
    - message (MessageCreate): Kullanıcıdan alınan mesajın içeriği.
    - db (Session): Veritabanı oturumu (db_dependency) ile sağlanır.
    - current_user (User): Şu anki oturum açmış kullanıcı (get_current_user ile alınır).

    Dönen Değer:
    - MessageOut: Veritabanına kaydedilmiş bot mesajı bilgileri.

    Hata Durumları:
    - Eğer model tahmini sırasında bir hata oluşursa, HTTP 500 döner ve hata mesajı içerir.
    """
    user_message = create_message(message=message, db=db, current_user=current_user)
    
    try:
        input_tensor = preprocess_input(message.text)
        model_output = model(input_tensor)
        bot_response_text = postprocess_output(model_output)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model prediction failed: {str(e)}"
        )
    
    bot_message = ChatMessage(
        sender="bot",
        text=bot_response_text,
        user_id=current_user["id"]
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    return bot_message

# Mesaj Oluşturma Endpoint'i
@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(
    message: MessageCreate,
    db: db_dependency,
    current_user: User = Depends(get_current_user)
):
    """
    Bu endpoint, kullanıcıların yeni bir mesaj oluşturmasını sağlar.
    
    Parametreler:
    - message: MessageCreate modeline göre mesaj içeriği.
    - db: Veritabanı oturumu (db_dependency) sağlanır.
    - current_user: Kullanıcının kimliği, get_current_user fonksiyonu ile doğrulanır.
    
    Dönen Değer:
    - Yeni oluşturulmuş mesaj, MessageOut modeline göre döndürülür.
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
    Bu endpoint, kullanıcının tüm mesajlarını getirir.
    
    Parametreler:
    - db: Veritabanı oturumu (db_dependency) sağlanır.
    - current_user: Kullanıcının kimliği, get_current_user fonksiyonu ile doğrulanır.
    
    Dönen Değer:
    - Kullanıcıya ait mesajların listesi, MessageOut modeline göre döndürülür.
    """
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user["id"]).order_by(ChatMessage.created_at.asc()).all()
    if not messages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No messages found for this user."
        )
    return messages