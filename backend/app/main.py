from fastapi import FastAPI
from app.api import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Sales Call Intelligence API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for local development/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "Sales Call Intelligence API running"}
