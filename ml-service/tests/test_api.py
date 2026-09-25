from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_predict_positive_text():
    response = client.post(
        "/predict",
        json={
            "text": "I absolutely love this product!"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["sentiment"] in [
        "positive",
        "negative",
        "neutral"
    ]

    assert 0 <= data["confidence"] <= 1