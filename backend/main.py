from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from model import ChurnModel
import uvicorn
from contextlib import asynccontextmanager

# Initialize the model
churn_model = ChurnModel()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Train model on startup
    churn_model.train()
    yield

app = FastAPI(title="Churn Prediction API", lifespan=lifespan)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    data: Dict[str, Any]
    model: str = "rf"

@app.get("/")
def read_root():
    return {"message": "Welcome to the Churn Prediction API"}

@app.get("/metrics")
def get_metrics():
    if not churn_model.is_trained:
        churn_model.train()
    return {
        "metrics": churn_model.metrics,
        "feature_importance": churn_model.feature_importance
    }

@app.get("/stats")
def get_stats():
    return churn_model.get_stats()

@app.post("/predict")
def predict(request: PredictionRequest):
    try:
        result = churn_model.predict(request.data, request.model)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
