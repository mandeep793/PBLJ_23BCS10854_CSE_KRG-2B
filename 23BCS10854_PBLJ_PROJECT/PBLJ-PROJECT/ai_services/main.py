# ai_services/main.py

from fastapi import FastAPI, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from database.mongodb import (
    insert_job,
    fetch_jobs_by_title,
    fetch_all_jobs,
    apply_for_job,
    fetch_applicants_by_job,
)
from PyPDF2 import PdfReader
import re
import os

app = FastAPI(title="SkillSync AI Services", version="2.1")

# ==============================
#       CORS CONFIGURATION
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from fastapi.staticfiles import StaticFiles

# ✅ Serve uploaded resumes (PDFs) from /uploads
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ==============================
#         ROOT ROUTE
# ==============================
@app.get("/")
def home():
    return {"message": "✅ SkillSync AI backend running successfully!"}


# ==============================
#     RECRUITER: Upload Job
# ==============================
@app.post("/api/recruiter/upload-job")
async def upload_job(job: Dict):
    """Recruiter uploads a new job posting."""
    success = insert_job(job)
    if success:
        return {"message": "Job uploaded successfully!", "job": job}
    return {"error": "Failed to upload job."}


# ==============================
#   RECRUITER: View Posted Jobs
# ==============================
@app.get("/api/recruiter/jobs")
def recruiter_jobs():
    """Fetch all jobs posted by recruiters."""
    jobs = fetch_all_jobs()
    return {"jobs": jobs}


# ==============================
#     JOB SEEKER: Search Jobs
# ==============================
@app.get("/api/jobs")
def get_jobs(title: str = Query(None)):
    """Fetch jobs by title or all if no title given."""
    if not title:
        jobs = fetch_all_jobs()
    else:
        jobs = fetch_jobs_by_title(title)
    return {"jobs": jobs}


# ==============================
#     JOB SEEKER: Upload Resume
# ==============================
@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Mock resume upload route — AI parsing integration later."""
    filename = file.filename
    print(f"📄 Received resume: {filename}")
    return {"message": f"Resume '{filename}' uploaded successfully"}


# ==============================
#     DEBUG: View All Jobs
# ==============================
@app.get("/api/debug/jobs")
def debug_jobs():
    """Manually verify all jobs stored in DB."""
    jobs = fetch_all_jobs()
    return {"count": len(jobs), "jobs": jobs}


# ==============================
#   AI: Resume–Job Skill Match
# ==============================
@app.post("/api/match-resume")
async def match_resume(file: UploadFile = File(...), job_skills: str = Query(...)):
    try:
        content = ""
        if file.filename.endswith(".pdf"):
            reader = PdfReader(file.file)
            for page in reader.pages:
                content += page.extract_text() or ""
        else:
            content = (await file.read()).decode("utf-8", errors="ignore")

        resume_text = content.lower()
        job_skill_list = [skill.strip().lower() for skill in job_skills.split(",") if skill.strip()]

        found_skills = [skill for skill in job_skill_list if re.search(r"\b" + re.escape(skill) + r"\b", resume_text)]
        match_percent = (len(found_skills) / len(job_skill_list)) * 100 if job_skill_list else 0
        missing_skills = list(set(job_skill_list) - set(found_skills))

        return {
            "match_percentage": round(match_percent, 2),
            "found_skills": found_skills,
            "missing_skills": missing_skills,
            "status": "eligible" if match_percent >= 50 else "needs improvement",
        }

    except Exception as e:
        print(f"❌ Error in resume matching: {e}")
        return {"error": "Resume parsing failed."}


# ==============================
#     JOB SEEKER: Apply for Job
# ==============================
from bson import ObjectId
import re
from datetime import datetime

def serialize_mongo_doc(doc):
    """Recursively convert MongoDB ObjectIds to strings for JSON serialization."""
    if isinstance(doc, list):
        return [serialize_mongo_doc(i) for i in doc]
    if isinstance(doc, dict):
        new_doc = {}
        for k, v in doc.items():
            if isinstance(v, ObjectId):
                new_doc[k] = str(v)
            else:
                new_doc[k] = serialize_mongo_doc(v)
        return new_doc
    return doc


@app.post("/api/apply-job")
async def apply_job(
    job_title: str = Form(...),
    recruiter_email: str = Form(...),
    seeker_name: str = Form(...),
    seeker_email: str = Form(...),
    resume: UploadFile = File(...),
):
    """Store a new job application safely."""
    try:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        # ✅ Clean filename to avoid spaces/special characters
        base_name, ext = os.path.splitext(resume.filename)
        safe_name = re.sub(r'[^a-zA-Z0-9_-]', '_', base_name)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        final_filename = f"{safe_name}_{timestamp}{ext}"

        resume_path = os.path.join(upload_dir, final_filename)

        # ✅ Save uploaded resume safely
        with open(resume_path, "wb") as f:
            f.write(await resume.read())

        # ✅ Generate proper public URL for recruiter access
        resume_url = f"http://127.0.0.1:8000/uploads/{final_filename}"

        # ✅ Prepare application record
        application = {
            "job_title": job_title,
            "recruiter_email": recruiter_email,
            "seeker_name": seeker_name,
            "seeker_email": seeker_email,
            "resume_url": resume_url,
        }

        success = apply_for_job(application)
        if success:
            safe_application = serialize_mongo_doc(application)
            return {
                "message": "✅ Application submitted successfully!",
                "application": safe_application,
            }

        return {"error": "Failed to apply for the job."}

    except Exception as e:
        print(f"❌ Error applying for job: {e}")
        return {"error": "Internal server error"}


# ==============================
#   RECRUITER: View Applicants
# ==============================
@app.get("/api/recruiter/applicants")
def get_applicants(job_title: str = Query(...)):
    """Fetch all applicants who applied for a particular job."""
    applicants = fetch_applicants_by_job(job_title)
    return {"applicants": applicants}


@app.get("/api/admin/overview")
def admin_overview():
    """Fetch counts of jobs, recruiters, seekers, and applications."""
    from database.mongodb import (
        fetch_all_jobs,
        fetch_all_applications,
        fetch_all_seekers,
        fetch_all_recruiters,
    )

    jobs = fetch_all_jobs()
    applications = fetch_all_applications()
    seekers = fetch_all_seekers()
    recruiters = fetch_all_recruiters()

    return {
        "total_jobs": len(jobs),
        "total_applications": len(applications),
        "total_seekers": len(seekers),
        "total_recruiters": len(recruiters),
    }
