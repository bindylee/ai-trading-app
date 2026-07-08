import { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

interface PortfolioData {
  userId: string;
  holdings: Holding[];
  cash: number;
  totalValue: number;
}

function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyForm, setBuyForm] = useState({ symbol: '', quantity: 1, price: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data.data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        '/api/portfolio/buy',
        buyForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Stock purchased successfully!');
      setBuyForm({ symbol: '', quantity: 1, price: 0 });
      fetchPortfolio();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Purchase failed');
    }
  };

  if (loading) return <div className="app-container"><p>Loading...</p></div>;

  return (
    <div className="app-container">
      <div className="portfolio">
        <h1>💼 Your Portfolio</h1>

        {portfolio && (
          <div className="portfolio-summary">
            <div className="summary-card">
              <p className="summary-label">Total Value</p>
              <p className="summary-value">${portfolio.totalValue.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Cash Available</p>
              <p className="summary-value">${portfolio.cash.toFixed(2)}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Holdings</p>
              <p className="summary-value">{portfolio.holdings.length}</p>
            </div>
          </div>
        )}

        <div className="portfolio-content">
          <div className="holdings-section">
            <h2>Holdings</h2>
            {portfolio?.holdings && portfolio.holdings.length > 0 ? (
              <div className="holdings-table">
                {portfolio.holdings.map((holding) => (
                  <div key={holding.symbol} className="holding-row">
                    <span className="symbol">{holding.symbol}</span>
                    <span className="quantity">Qty: {holding.quantity}</span>
                    <span className="price">Avg: ${holding.avgPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No holdings yet. Buy some stocks!</p>
            )}
          </div>

          <div className="buy-section">
            <h2>Buy Stock</h2>
            <form onSubmit={handleBuyStock}>
              <input
                type="text"
                placeholder="Symbol (e.g., AAPL)"
                value={buyForm.symbol}
                onChange={(e) => setBuyForm({ ...buyForm, symbol: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={buyForm.quantity}
                onChange={(e) => setBuyForm({ ...buyForm, quantity: parseInt(e.target.value) })}
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Price per share"
                step="0.01"
                value={buyForm.price}
                onChange={(e) => setBuyForm({ ...buyForm, price: parseFloat(e.target.value) })}
                required
              />
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              <button type="submit">Buy</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;