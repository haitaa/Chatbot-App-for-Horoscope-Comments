from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from config.database import Base
from .user import User
from .mixins import TimestampMixin

class Repost(Base, TimestampMixin):
    __tablename__ = "reposts"

    id = Column(Integer, primary_key=True, index=True)
    tweet_id = Column(Integer, ForeignKey("tweets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    tweet = relationship("Tweet", back_populates="reposts")
    user = relationship("User", back_populates="reposted_tweets")

    def __repr__(self):
        return f"<Repost(id={self.id}, tweet_id={self.tweet_id}, user_id={self.user_id})>"
    
User.reposted_tweets = relationship("Repost", back_populates="user")