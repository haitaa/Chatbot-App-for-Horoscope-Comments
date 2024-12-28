from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship

from config.database import Base
from .mixins import TimestampMixin

follows = Table(
    "follows",
    Base.metadata,
    Column("follower_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("following_id", Integer, ForeignKey("users.id"), primary_key=True)
)

class User(Base, TimestampMixin):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    following = relationship(
        "User",
        secondary=follows,
        primaryjoin=id == follows.c.follower_id,
        secondaryjoin=id == follows.c.following_id,
        back_populates="followers"
    )

    followers = relationship(
        "User",
        secondary=follows,
        primaryjoin=id == follows.c.following_id,
        secondaryjoin=id == follows.c.follower_id,
        back_populates="following"
    )

    tweets = relationship("Tweet", back_populates="user", cascade="all, delete-orphan")
    liked_tweets = relationship("Like", back_populates="user")
    reposted_tweets = relationship("Repost", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    bookmarked_tweets = relationship("Bookmark", back_populates="user")

from .tweet import Tweet
from .like import Like
from .repost import Repost
from .comment import Comment
from .bookmark import Bookmark