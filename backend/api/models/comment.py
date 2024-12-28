from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship

from .user import User
from .mixins import TimestampMixin
from config.database import Base

class Comment(Base, TimestampMixin):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)  # Yorum içeriği
    tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=False)  # Yorum yapılan tweet'in ID'si
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Yorum yapan kullanıcı
    
    tweet = relationship("Tweet", back_populates="comments")
    user = relationship("User", back_populates="comments")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, tweet_id={self.tweet_id}, user_id={self.user_id}, content={self.content})>"

# Kullanıcı modelinde yorumların ilişkisinin tanımlanması
User.comments = relationship("Comment", back_populates="user")
