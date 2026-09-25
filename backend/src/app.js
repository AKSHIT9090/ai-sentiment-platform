const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const predictionRoutes = require("./routes/predictionRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/predictions", predictionRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "backend",
        message: "Sentiment Analysis API is running"
    });
});

app.get("/api/db-health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.status(200).json({
            status: "connected",
            database: "sentiment_platform",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on port ${PORT}`);
    });
}

module.exports = app;