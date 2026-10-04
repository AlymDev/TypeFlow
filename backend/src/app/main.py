from fastapi import FastAPI
from sqlalchemy import text

from .database import engine

app = FastAPI(title="TypeFlow API")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/health/live")
def health_live()->dict[str, str]:
    return {"status":"alive"}

@app.get("/health/ready")
def health_ready() -> dict[str, str]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"status": "ready"}
    except Exception:
        return {"status": "unavailable"}