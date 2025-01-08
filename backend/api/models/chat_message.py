from sqlalchemy import Column, Integer, Text, ForeignKey, String
from sqlalchemy.orm import relationship
from config.database import Base
from models.mixins import TimestampMixin

class ChatMessage(Base, TimestampMixin):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)

    # İlişki tanımı
    user = relationship("User", back_populates="chat_messages")
