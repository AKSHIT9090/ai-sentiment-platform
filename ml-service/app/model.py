from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


TRAINING_TEXTS = [
    "I love this product",
    "This is amazing",
    "Excellent service",
    "I am very happy",
    "What a wonderful experience",
    "This is fantastic",
    "I hate this product",
    "This is terrible",
    "Very poor service",
    "I am very disappointed",
    "What a horrible experience",
    "This is awful",
    "It is okay",
    "The product is average",
    "Nothing special about it",
    "The experience was normal",
    "It is fine",
    "The service was acceptable"
]

TRAINING_LABELS = [
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "positive",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "negative",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral",
    "neutral"
]


model = Pipeline([
    ("vectorizer", TfidfVectorizer()),
    ("classifier", LogisticRegression(max_iter=1000))
])

model.fit(TRAINING_TEXTS, TRAINING_LABELS)


def predict_sentiment(text: str):
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    confidence = max(probabilities)

    return {
        "sentiment": prediction,
        "confidence": round(float(confidence), 4)
    }