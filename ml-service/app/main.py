from fastapi import FastAPI, HTTPException

from app.model import predict_sentiment
from app.schemas import SentimentRequest, SentimentResponse


app = FastAPI(
    title="AI Sentiment Analysis Service",
    version="1.0.0"
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ml-service"
    }


@app.post("/predict", response_model=SentimentResponse)
def predict(request: SentimentRequest):
    try:
        result = predict_sentiment(request.text)
        return result
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )