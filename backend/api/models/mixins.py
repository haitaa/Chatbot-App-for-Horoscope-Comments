from sqlalchemy import DateTime, func, Column

class TimestampMixin:
  created_at = Column(DateTime, default=func.now())
  updated_at = Column(DateTime, default=func.now(), onupdate=func.now())