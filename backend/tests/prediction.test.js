const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/services/mlService", () => ({
    predictSentiment: jest.fn()
}));

jest.mock("../src/config/database", () => ({
    query: jest.fn()
}));

const { predictSentiment } = require("../src/services/mlService");
const pool = require("../src/config/database");

describe("Prediction API", () => {
    test("POST /api/predictions should create a prediction", async () => {
        predictSentiment.mockResolvedValue({
            sentiment: "positive",
            confidence: 0.92
        });

        pool.query.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    text: "I really love this application!",
                    sentiment: "positive",
                    confidence: "0.9200",
                    created_at: new Date()
                }
            ]
        });

        const response = await request(app)
            .post("/api/predictions")
            .send({
                text: "I really love this application!"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.prediction.text).toBe(
            "I really love this application!"
        );
        expect(response.body.prediction.sentiment).toBe("positive");
        expect(response.body.prediction.confidence).toBe("0.9200");
    });
});