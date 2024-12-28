from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from .user import User
from config.database import Base
from .mixins import TimestampMixin

class Tweet(Base, TimestampMixin):
    __tablename__ = "tweets"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    parent_tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=True)

    user = relationship("User", back_populates="tweets")
    parent_tweet = relationship("Tweet", remote_side=[id], backref="replies")
    likes = relationship("Like", back_populates="tweet")
    reposts = relationship("Repost", back_populates="tweet")
    comments = relationship("Comment", back_populates="tweet")
    bookmarks = relationship("Bookmark", back_populates="tweet")

    def __repr__(self):
        return f"<Tweet(id={self.id}, content={self.content})>"
    
User.tweets = relationship("Tweet", back_populates="user")