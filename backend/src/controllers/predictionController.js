const pool = require("../config/database");
const { predictSentiment } = require("../services/mlService");

const createPrediction = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                status: "error",
                message: "Text is required"
            });
        }

        const prediction = await predictSentiment(text);

        const result = await pool.query(
            `INSERT INTO predictions (text, sentiment, confidence)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
                text,
                prediction.sentiment,
                prediction.confidence
            ]
        );

        res.status(201).json({
            status: "success",
            prediction: result.rows[0]
        });
    } catch (error) {
        console.error("Prediction creation error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to process prediction"
        });
    }
};

const getPredictions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM predictions
             ORDER BY created_at DESC`
        );

        res.status(200).json({
            status: "success",
            predictions: result.rows
        });
    } catch (error) {
        console.error("Prediction retrieval error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to retrieve predictions"
        });
    }
};

module.exports = {
    createPrediction,
    getPredictions
};