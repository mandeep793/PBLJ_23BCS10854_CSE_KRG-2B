# ai_services/matcher/scorer.py
def calculate_matching_score(resume_skills, job_skills):
    if not job_skills or not resume_skills:
        return 0
    matched = [skill for skill in resume_skills if skill.lower() in [s.lower() for s in job_skills]]
    score = (len(matched) / len(job_skills)) * 100
    return round(score, 2)
