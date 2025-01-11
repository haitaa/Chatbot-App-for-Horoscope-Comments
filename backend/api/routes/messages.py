from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import joinedload
from typing import Optional, List

from models.user import User
from models.message import Message
from dependencies.dependency import db_dependency, user_dependency

router = APIRouter(
  prefix="/messages",
  tags=["messages"]
)

class MessageBase(BaseModel):
  sender_id: int
  receiver_id: int
  content: str
  emoji: Optional[str] = None
  image_url: Optional[str] = None
  audio_url: Optional[str] = None
  video_url: Optional[str] = None

class MessageCreate(MessageBase):
  messages: List[int] =[]



@router.get("/")
def get_messages(db: db_dependency, user: user_dependency):
  """
    Kullanıcıya ait gönderilen ve alınan tüm mesajları getirir.

    Parametreler:
    - db (Session): Veritabanı oturumu.
    - user (dict): Şu anki oturum açmış kullanıcı bilgileri.

    Dönen Değer:
    - dict: Kullanıcı tarafından gönderilen ve alınan mesajlar.

    Hata Durumları:
    - Mesaj bulunmazsa boş bir liste döner.
    """
  sent_messages = db.query(Message).filter(Message.sender_id == user.get("id")).all()
  received_messages = db.query(Message).filter(Message.receiver_id == user.get("id")).all()
  return {"sended": sent_messages, "received": received_messages}

@router.post("/")
def create_message(db: db_dependency, user: user_dependency, message: MessageCreate):
  """
    Yeni bir mesaj oluşturur ve veritabanına kaydeder.

    Parametreler:
    - db (Session): Veritabanı oturumu.
    - user (dict): Şu anki oturum açmış kullanıcı bilgileri.
    - message (MessageCreate): Gönderilecek mesajın içeriği.

    Hata Durumları:
    - Eğer kullanıcı, gönderici olarak belirtilmemişse HTTP 403 döner.
    - Alıcı kullanıcı bulunmazsa HTTP 404 döner.

    Dönen Değer:
    - dict: Yeni oluşturulan mesaj bilgileri.
  """
  if user.get("id") != message.sender_id:
    raise HTTPException(status_code=403, detail="You are not allowed to send this message.")
  
  receiver = db.query(User).filter(User.id == message.receiver_id).first()
  if not receiver:
    raise HTTPException(status_code=404, detail="Receiver not found.")

  db_message = Message(
    sender_id=int(user.get("id")),
    receiver_id=int(message.receiver_id),
    content=message.content,
    emoji=message.emoji,
    image_url=message.image_url,
    audio_url=message.audio_url,
    video_url=message.video_url,
  )

  db.add(db_message)
  db.commit()
  db.refresh(db_message)

@router.put("/{id}")
def update_message(db: db_dependency, user: user_dependency, message: MessageCreate, id: int):
  """
    Belirtilen bir mesajı günceller.

    Parametreler:
    - db (Session): Veritabanı oturumu.
    - user (dict): Şu anki oturum açmış kullanıcı bilgileri.
    - message (MessageCreate): Güncellenmiş mesaj içeriği.
    - id (int): Güncellenecek mesajın ID'si.

    Hata Durumları:
    - Mesaj bulunamazsa HTTP 404 döner.
    - Kullanıcı mesajı düzenleme yetkisine sahip değilse HTTP 403 döner.

    Dönen Değer:
    - dict: Güncellenmiş mesaj bilgileri.
    """
  db_message = db.query(Message).filter(Message.id == id).first()

  if not db_message:
    raise HTTPException(status_code=404, detail="Message not found.")
  
  if db_message.sender_id != user.get("id"):
    raise HTTPException(status_code=403, detail="You are not allowed to update this message.")
  
  updated_data = {
    "content": message.content,
    "emoji": message.emoji,
    "image_url": message.image_url,
    "audio_url": message.audio_url,
    "video_url": message.video_url,
  }

  for field, value in updated_data.items():
    if value:
      setattr(db_message, field, value)

  db.commit()
  db.refresh(db_message)
      
@router.delete("/{id}")
def delete_message(id: int, db: db_dependency, user: user_dependency):
  """
    Belirtilen bir mesajı siler.

    Parametreler:
    - id (int): Silinecek mesajın ID'si.
    - db (Session): Veritabanı oturumu.
    - user (dict): Şu anki oturum açmış kullanıcı bilgileri.

    Hata Durumları:
    - Mesaj bulunamazsa HTTP 404 döner.
    - Kullanıcı mesajı silme yetkisine sahip değilse HTTP 403 döner.

    Dönen Değer:
    - dict: Silme işleminin başarı durumunu belirten bir mesaj.
    """
  db_message = db.query(Message).filter(Message.id == id).first()

  if not db_message:
    raise HTTPException(status_code=404, detail="Message not found.")

  if db_message.sender_id != user.get("id") and db_message.receiver_id != user.get("id"):
    raise HTTPException(status_code=403, detail="You are not allowed to delete this message.")
  
  db.delete(db_message)
  db.commit()

  return { "detail": "Message deleted successfully" }