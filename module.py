from typing  import Optional
from pydantic import BaseModel

class Account(BaseModel):
    account_name: str
    account_password: Optional[str] = None