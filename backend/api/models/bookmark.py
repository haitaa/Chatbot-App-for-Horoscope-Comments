from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from .user import User
from .mixins import TimestampMixin
from config.database import Base

class Bookmark(Base, TimestampMixin):
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=False)  # Kaydedilen tweet'in ID'si
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Kaydeden kullanıcı
    
    tweet = relationship("Tweet", back_populates="bookmarks")
    user = relationship("User", back_populates="bookmarked_tweets")

    def __repr__(self):
        return f"<Bookmark(id={self.id}, tweet_id={self.tweet_id}, user_id={self.user_id})>"

# Kullanıcı modelinde kaydedilen tweet'lerin ilişkisinin tanımlanması
User.bookmarked_tweets = relationship("Bookmark", back_populates="user")
