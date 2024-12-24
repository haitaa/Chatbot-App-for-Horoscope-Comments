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
  email: Optional[str] 
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

    Parametreler:
    - `db` (Session): Veritabanı bağlantısı.

    Dönüş:
    - Kullanıcıların bir listesi.
    - Eğer veritabanında kullanıcı yoksa boş bir liste döndürür.
    """
  return db.query(User).all()

@router.get("/me", response_model=UserSchema)
async def get_current_user(current_user: UserSchema = Depends(get_current_user)):
  """
    Geçerli kullanıcıyı döndüren endpoint.

    Parametreler:
    - `current_user` (UserSchema): Şu anda oturum açmış olan kullanıcı.

    Dönüş:
    - Geçerli kullanıcının bilgileri (id, username, email vb.).
    - Eğer kullanıcı oturum açmamışsa, 401 Unauthorized hatası döner.
    """
  return current_user

@router.get("/{user_id}")
def get_user_by_id(user_id: int, db: db_dependency):
  """
    Belirtilen kullanıcı ID'sine göre kullanıcıyı döndüren endpoint.

    Parametreler:
    - `user_id` (int): Kullanıcının benzersiz kimliği.
    - `db` (Session): Veritabanı bağlantısı.

    Dönüş:
    - İlgili kullanıcının bilgileri.
    - Eğer kullanıcı bulunamazsa, 404 Not Found hatası döner.
    """
  
  user = db.query(User).filter(User.id == user_id).first()
  if user is None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  return user

@router.get("/{user_id}/following", response_model=List[UserSchema])
def get_following(user_id: int, db: db_dependency):
  """
    Belirtilen kullanıcının takip ettiği kullanıcıları döndüren endpoint.

    Parametreler:
    - `user_id` (int): Kullanıcının benzersiz kimliği.
    - `db` (Session): Veritabanı bağlantısı.

    Dönüş:
    - Kullanıcının takip ettiği kullanıcıların bir listesi.
    - Eğer kullanıcı bulunamazsa, 404 Hata döndürülür.
    """

  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  return user.following

@router.get("/{user_id}/followers", response_model=List[UserSchema])
def get_followers(user_id: int, db: db_dependency):
  """
    Belirtilen kullanıcının takipçilerini döndüren endpoint.

    Parametreler:
    - `user_id` (int): Kullanıcının benzersiz kimliği.
    - `db` (Session): Veritabanı bağlantısı.

    Dönüş:
    - Kullanıcının takipçilerinin bir listesi.
    - Eğer kullanıcı bulunamazsa, 404 Hata döndürülür.
    """

  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
  return user.followers


@router.post("/{user_id}/follow", status_code=status.HTTP_200_OK)
def follow_user(user_id: int, current_user_id: int, db: db_dependency):
    """
    Belirtilen kullanıcıyı takip etme işlemini gerçekleştiren endpoint.

    Parametreler:
    - `user_id` (int): Takip edilecek kullanıcının benzersiz kimliği.
    - `current_user_id` (int): Oturum açmış olan kullanıcının benzersiz kimliği.
    - `db` (Session): Veritabanı bağlantısı.

    İşleyiş:
    - Verilen `user_id` ile takip edilecek kullanıcı veritabanında aranır.
    - Verilen `current_user_id` ile oturum açmış kullanıcı veritabanında aranır.
    - Eğer `user_id`'ye sahip kullanıcı bulunamazsa, 404 Hata döndürülür.
    - Eğer oturum açmış kullanıcı (`current_user`) daha önce belirtilen kullanıcıyı takip ediyorsa, 400 Hata döndürülür.
    - Kullanıcı kendisini takip etmeye çalışırsa, 400 Hata döndürülür.
    - Belirtilen kullanıcı takip edilmek üzere `current_user.following` listesine eklenir ve veritabanı değişiklikleri kaydedilir.

    Dönüş:
    - Takip başarılı olduğunda 200 OK ve bilgilendirici bir mesaj döndürülür.
    - Hatalı durumlarda uygun HTTP hatası ve açıklama döndürülür.
    """
    user_to_follow = db.query(User).filter(User.id == user_id).first()
    current_user = db.query(User).filter(User.id == current_user_id).first()

    if not user_to_follow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user_to_follow in current_user.following:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already following")
    
    if user_to_follow.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot follow yourself")
    
    current_user.following.append(user_to_follow)
    db.commit()
    return { "message": f"You are now following {user_to_follow}" }
