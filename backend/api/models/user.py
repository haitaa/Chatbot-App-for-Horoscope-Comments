from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime, func
from sqlalchemy.orm import relationship

from config.database import Base
from .mixins import TimestampMixin

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
