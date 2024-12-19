from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from .mixins import TimestampMixin
from config.database import Base

class Message(Base, TimestampMixin):
  __tablename__ = "messages"

  id = Column(Integer, primary_key=True, index=True)
  sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  content = Column(String, nullable=False)
  emoji = Column(String, nullable=True)
  image_url = Column(String, nullable=True)
  audio_url = Column(String, nullable=True)
  video_url = Column(String, nullable=True)

  sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")
  receiver = relationship("User", foreign_keys=[receiver_id], backref="received_messages")
  