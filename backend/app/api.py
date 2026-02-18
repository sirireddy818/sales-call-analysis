from fastapi import APIRouter, UploadFile, File
from utils.audio_utils import audio_to_text
from utils.analysis_utils import analyze_text, aggregate_results
from app.db import init_db, add_call, get_analytics as db_get_analytics, get_all_calls

# Initialize DB on start (simple way)
init_db()

router = APIRouter(prefix="/api")

@router.post("/analyze")
async def analyze_call(file: UploadFile = File(...)):
    text = audio_to_text(file)
    result = analyze_text(text)
    
    # Save to DB
    add_call(file.filename, result["sentiment"], result["objections"], result["summary"])
    
    return result


@router.post("/analyze/batch")
async def analyze_multiple(files: list[UploadFile] = File(...)):
    results = []

    for file in files:
        text = audio_to_text(file)
        result = analyze_text(text)
        results.append(result)
        # Save to DB
        add_call(file.filename, result["sentiment"], result["objections"], result["summary"])

    summary = aggregate_results(results)
    return {
        "calls": results,
        "summary": summary
    }

@router.get("/analytics")
async def get_analytics_data():
    return db_get_analytics()

@router.get("/reports")
async def get_reports():
    return get_all_calls()
