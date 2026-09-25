const axios = require("axios");

const predictSentiment = async (text) => {
    const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        {
            text
        }
    );

    return response.data;
};

module.exports = {
    predictSentiment
};