# ai_services/database/mongodb.py

from pymongo import MongoClient
import os

# ✅ MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "skillsync"  # ✅ your actual DB name

client = MongoClient(MONGO_URI)
db = client[DB_NAME]


# --------------------------- DB Helpers ---------------------------

def get_db():
    return db


# ============================== JOB OPERATIONS ==============================
def insert_job(job_data):
    """Insert a recruiter-posted job"""
    result = db["jobs"].insert_one(job_data)
    return str(result.inserted_id)


def fetch_jobs_by_title(title):
    """Search jobs by title (case-insensitive regex match)"""
    jobs = list(db["jobs"].find({"title": {"$regex": title, "$options": "i"}}))
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs


def fetch_all_jobs():
    """Fetch all jobs (for debugging or user view)"""
    jobs = list(db["jobs"].find())
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs


# ============================== APPLICATION OPERATIONS ==============================
def apply_for_job(application):
    """
    Store job application details.
    Expected fields:
    job_title, recruiter_email, seeker_name, seeker_email, resume_url
    """
    try:
        db["applications"].insert_one(application)
        return True
    except Exception as e:
        print("❌ Error saving application:", e)
        return False


def fetch_applicants_by_job(job_title):
    """Fetch all applicants for a given job title"""
    try:
        applicants = list(db["applications"].find({"job_title": job_title}))
        for a in applicants:
            a["_id"] = str(a["_id"])
        return applicants
    except Exception as e:
        print("❌ Error fetching applicants:", e)
        return []

