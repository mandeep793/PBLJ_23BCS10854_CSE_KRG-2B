# ai_services/models/job_model.py
from pydantic import BaseModel
from typing import List, Optional

class Job(BaseModel):
    title: str
    company: str
    description: str
    location: Optional[str]
    skills: List[str]
