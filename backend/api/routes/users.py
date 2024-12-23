from typing import Optional, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from models.user import User
from dependencies.dependency import db_dependency
from .auth import get_current_user

router = APIRouter(
  prefix="/users",
  tags=["users"]
)

class UserSchema(BaseModel):
  id: int
  username: str
  email: str
  first_name: Optional[str] = None
  last_name: Optional[str] = None
  profile: Optional[str] = None
  bio: Optional[str] = None


  class Config:
    from_attributes = True

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.get("/")
def get_user(db: db_dependency, user_id: int):
  return db.query(User).filter(User.id == user_id).first()

@router.get("/users")
def get_users(db: db_dependency):
  """
    Tüm kullanıcıları döndüren endpoint.
  """
  return db.query(User).all()

@router.get("/me", response_model=UserSchema)
async def get_current_user(current_user: UserSchema = Depends(get_current_user)):
  """
  Geçerli kullanıcıyı döndürent endpoint.
  """
  return current_user

@router.get("/{user_id}")
def get_user_by_id(user_id: int, db: db_dependency):
  user = db.query(User).filter(User.id == user_id).first()
  if user is None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  return user