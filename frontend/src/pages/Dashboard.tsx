import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('accessToken');

  const fetchStocks = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/stocks/search', {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(response.data.data.results);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks('AAPL');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStocks(searchQuery);
  };

  return (
    <div className="app-container">
      <div className="dashboard">
        <h1>📊 Stock Market Dashboard</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search stocks (e.g., AAPL, MSFT)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {loading && <p className="loading">Loading...</p>}

        <div className="stocks-grid">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="stock-card">
              <h3>{stock.symbol}</h3>
              <p className="stock-name">{stock.name}</p>
              <p className="stock-price">${stock.price.toFixed(2)}</p>
              <p className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                {stock.change >= 0 ? '📈' : '📉'} {stock.changePercent}%
              </p>
              <p className="stock-market-cap">Market Cap: {stock.marketCap}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;