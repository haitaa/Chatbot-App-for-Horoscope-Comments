from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from pydantic import BaseModel

from dependencies.dependency import db_dependency, get_current_user
from models.tweet import Tweet
from models.user import User

router = APIRouter(
    prefix="/tweets",
    tags=["tweets"]
)

class TweetBase(BaseModel):
    content: str

class TweetCreate(TweetBase):
    pass

class TweetOut(TweetBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=TweetOut, status_code=status.HTTP_201_CREATED)
def create_tweet(tweet: TweetCreate, db: db_dependency, current_user: User = Depends(get_current_user)):
    """
    Bu endpoint, kullanıcıların yeni bir tweet oluşturmasını sağlar.
    
    Parametreler:
    - tweet: TweetCreate modeline göre tweet içeriği.
    - db: Veritabanı oturumu (db_dependency) sağlanır.
    - current_user: Kullanıcının kimliği, get_current_user fonksiyonu ile doğrulanır.
    
    Dönen Değer:
    - Yeni oluşturulmuş tweet, TweetOut modeline göre döndürülür.
    """
    new_tweet = Tweet(content=tweet.content, user_id=current_user["id"], created_at=datetime.now(timezone.utc))
    db.add(new_tweet)
    db.commit()
    db.refresh(new_tweet)
    return new_tweet

@router.get("/", response_model=List[TweetOut], status_code=status.HTTP_200_OK)
def get_all_tweets(db: db_dependency):
    """
    Bu endpoint, tüm tweet'leri döndürür.
    
    Parametreler:
    - db: Veritabanı oturumu (db_dependency) sağlanır.
    
    Dönen Değer:
    - Tweet'lerin bir listesi (TweetOut modeli ile döndürülür).
    """
    tweets = db.query(Tweet).all()
    return tweets

@router.get("/my_tweets", response_model=List[TweetOut], status_code=status.HTTP_200_OK)
def get_user_tweets(db: db_dependency, current_user_id: int):
    """
    Bu endpoint, belirli bir kullanıcının tweet'lerini döndürür.
    
    Parametreler:
    - db: Veritabanı oturumu (db_dependency) sağlanır.
    - current_user_id: Kullanıcının ID'si.
    
    Dönen Değer:
    - Kullanıcıya ait tweet'lerin bir listesi (TweetOut modeli ile döndürülür).
    
    Hata Durumu:
    - Eğer kullanıcıya ait tweet bulunamazsa, 404 Not Found hatası döner.
    """
    current_user = db.query(User).filter(User.id == current_user_id).first()
    if not current_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    tweets = db.query(Tweet).filter(Tweet.user_id == current_user.id).order_by(Tweet.created_at.desc()).all()
    if not tweets:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No tweets found for this user.")
    return tweets
