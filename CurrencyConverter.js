import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
  const [currencies] = useState(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rate, setRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rates?base=${fromCurrency}&target=${toCurrency}`
        );
        setRate(response.data.rate);
        setConvertedAmount((amount * response.data.rate).toFixed(2));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch rates');
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmount(value || 0);
    if (rate) setConvertedAmount((value * rate).toFixed(2));
  };

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          min="0"
        />
        <select 
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
        <span>→</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {convertedAmount && (
        <div className="result">
          <p>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</p>
          {rate && <p>1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}</p>}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;