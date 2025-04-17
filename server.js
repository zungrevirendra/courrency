require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/rates', async (req, res) => {
  const { base, target } = req.query;
  
  if (!base || !target) {
    return res.status(400).json({ error: 'Both base and target currencies are required' });
  }

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${base}/${target}`
    );
    res.json({
      base,
      target,
      rate: response.data.conversion_rate
    });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch exchange rate',
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});