import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchPredictions = async () => {
        try {
            const response = await axios.get(`${API_URL}/predictions`);
            setPredictions(response.data.predictions);
        } catch {
            setError("Unable to load prediction history.");
        }
    };

    useEffect(() => {
    let cancelled = false;

    const loadPredictions = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/predictions`
            );

            if (!cancelled) {
                setPredictions(response.data.predictions);
            }
        } catch {
            if (!cancelled) {
                setError("Unable to load prediction history.");
            }
        }
      };

      loadPredictions();

      return () => {
          cancelled = true;
      };
    }, []);

    const analyseSentiment = async () => {
        if (!text.trim()) {
            setError("Please enter some text first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await axios.post(
                `${API_URL}/predictions`,
                { text }
            );

            setResult(response.data.prediction);
            setText("");
            fetchPredictions();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to analyse the text."
            );
        } finally {
            setLoading(false);
        }
    };

    const getSentimentClass = (sentiment) => {
        if (sentiment === "positive") return "positive";
        if (sentiment === "negative") return "negative";
        return "neutral";
    };

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>AI Sentiment Analysis</h1>
                    <p>
                        Analyse text using a machine learning model
                    </p>
                </div>

                <div className="status">
                    <span className="status-dot"></span>
                    System Online
                </div>
            </header>

            <main className="container">
                <section className="card analyser">
                    <h2>Analyse Text</h2>

                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Enter a sentence to analyse..."
                        maxLength={5000}
                    />

                    <div className="input-footer">
                        <span>{text.length}/5000</span>

                        <button
                            onClick={analyseSentiment}
                            disabled={loading}
                        >
                            {loading
                                ? "Analysing..."
                                : "Analyse Sentiment"}
                        </button>
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                </section>

                {result && (
                    <section className="card result-card">
                        <h2>Analysis Result</h2>

                        <div className="result-content">
                            <div>
                                <span className="label">
                                    Sentiment
                                </span>

                                <span
                                    className={`sentiment ${getSentimentClass(
                                        result.sentiment
                                    )}`}
                                >
                                    {result.sentiment.toUpperCase()}
                                </span>
                            </div>

                            <div>
                                <span className="label">
                                    Confidence
                                </span>

                                <strong>
                                    {(
                                        Number(result.confidence) * 100
                                    ).toFixed(2)}
                                    %
                                </strong>
                            </div>
                        </div>
                    </section>
                )}

                <section className="card">
                    <div className="section-header">
                        <div>
                            <h2>Recent Predictions</h2>
                            <p>Latest sentiment analyses</p>
                        </div>

                        <button
                            className="refresh"
                            onClick={fetchPredictions}
                        >
                            Refresh
                        </button>
                    </div>

                    {predictions.length === 0 ? (
                        <p className="empty">
                            No predictions yet.
                        </p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Text</th>
                                        <th>Sentiment</th>
                                        <th>Confidence</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {predictions.map((prediction) => (
                                        <tr key={prediction.id}>
                                            <td>{prediction.text}</td>

                                            <td>
                                                <span
                                                    className={`badge ${getSentimentClass(
                                                        prediction.sentiment
                                                    )}`}
                                                >
                                                    {prediction.sentiment}
                                                </span>
                                            </td>

                                            <td>
                                                {(
                                                    Number(
                                                        prediction.confidence
                                                    ) * 100
                                                ).toFixed(2)}
                                                %
                                            </td>

                                            <td>
                                                {new Date(
                                                    prediction.created_at
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            <footer>
                <p>
                    AI Sentiment Analysis Platform • Node.js • Python •
                    PostgreSQL
                </p>
            </footer>
        </div>
    );
}

export default App;