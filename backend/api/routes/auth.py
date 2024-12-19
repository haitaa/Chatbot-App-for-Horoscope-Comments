from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session

from models.user import User
from dependencies.dependency import db_dependency, bcrypt_context

load_dotenv()

router = APIRouter(
  prefix='/auth',
  tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

class UserCreateRequest(BaseModel):
  username: str
  password: str

class UserPydantic(BaseModel):
  id: int
  username: str
  email: Optional[str] = None
  first_name: Optional[str] = None
  last_name: Optional[str] = None
  profile_picture: Optional[str] = None
  bio: Optional[str] = None

  class Config:
    from_attributes = True

class Token(BaseModel):
  access_token: str
  token_type: str
  user: UserPydantic


def authenticate_user(username: str, password: str, db) -> Union[bool, User]:
  """
    Kullanıcının kimlik doğrulamasını yapar.

    Bu fonksiyon, verilen kullanıcı adı (username) ve parola (password) bilgilerine göre 
    bir kullanıcının kimlik doğrulamasını gerçekleştirir. Eğer kullanıcı adı veya parola 
    yanlışsa `False`, doğruysa `User` modeli döndürülür.

    Args:
        username (str): Doğrulama için kullanılan kullanıcı adı.
        password (str): Doğrulama için kullanılan parola.
        db (Session): Veritabanı bağlantısı için SQLAlchemy oturumu.

    Returns:
        Union[bool, User]: 
            - Eğer kullanıcı bulunamazsa veya parola yanlışsa `False`.
            - Kullanıcı başarıyla doğrulanırsa `User` modeli.

    Raises:
        Bu fonksiyon herhangi bir özel hata fırlatmaz. Ancak, çağıran yer hataları yönetebilir.
    """
  user = db.query(User).filter(User.username == username).first()
  if not user or not bcrypt_context.verify(password, user.password):
    return False
  return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
  """
    Kullanıcı için bir JWT oluşturur.

    Args:
        username (str): Kullanıcının kullanıcı adı.
        user_id (int): Kullanıcının benzersiz kimliği.
        expires_delta (Optional[timedelta]): Token'in ne kadar süreyle geçerli olacağını belirtir.

    Returns:
        str: Oluşturulan JWT (JSON Web Token).
    """
  encode = {"sub": username, "id": user_id}
  expires = datetime.now(timezone.utc) + expires_delta
  encode.update({"exp": expires})
  return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(db_dependency)) -> User:
  """
    Kullanıcıyı JWT token'ı ile doğrular ve veritabanından kullanıcıyı döndürür.
    
    Args:
        token (str): Authorization başlığından alınan JWT token.
        db (Session): Veritabanı bağlantısı.

    Returns:
        User: Geçerli kullanıcıyı döndürür.
    """
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get("sub")
    user_id: int = payload.get("id")

    if username is None or user_id is None:
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()

    if user is None:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    

    return user
  except JWTError: 
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
  """
    Yeni bir kullanıcı oluşturur.

    Kullanıcının kullanıcı adı ve şifre bilgilerini alır, şifreyi hashleyerek veritabanına kaydeder.

    Args:
        db (Session): Veritabanı bağlantısı için SQLAlchemy oturumu.
        create_user_request (UserCreateRequest): Kullanıcının `username` ve `password` bilgilerini içeren istek.

    Returns:
        None: HTTP 201 yanıt kodu döner.
    """
  create_user_model = User(
    username=create_user_request.username,
    password=bcrypt_context.hash(create_user_request.password),
  )
  db.add(create_user_model)
  db.commit()

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency) -> Union[dict, HTTPException]:
  """
    Kullanıcı girişi yapar ve bir erişim token'i döner.

    Kullanıcının kullanıcı adı ve şifresini doğrular. Eğer başarılı olursa, 
    belirli bir süre için geçerli olan bir JWT (JSON Web Token) döner.

    Args:
        form_data (OAuth2PasswordRequestForm): Kullanıcının `username` ve `password` bilgilerini içeren form.
        db (Session): Veritabanı bağlantısı için SQLAlchemy oturumu.

    Returns:
        dict: 
            - `access_token` (str): Erişim token'i.
            - `token_type` (str): Token'in türü (genellikle "bearer").
    
    Raises:
        HTTPException: Kullanıcı doğrulaması başarısız olursa 401 Unauthorized döner.
    """
  user = authenticate_user(form_data.username, form_data.password, db)
  if not user:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
  token = create_access_token(user.username, user.id, timedelta(minutes=20))

  user_data = {
    "id": user.id,
    "email": user.email,
    "username": user.username,
    "first_name": user.first_name,
    "last_name": user.last_name,
    "profile_picture": user.profile,
    "bio": user.bio,
  }

  return { "access_token" : token, "token_type": "bearer", "user": user_data } 
  
@router.get("/me", response_model=UserPydantic)
async def get_me(current_user: UserPydantic = Depends(get_current_user)):
  """
    Giriş yapmış kullanıcının bilgilerini döndürür.

    Args:
        current_user (User): JWT token ile doğrulanan kullanıcı.

    Returns:
        User: Kullanıcı bilgilerini döndürür.
    """
  return current_user