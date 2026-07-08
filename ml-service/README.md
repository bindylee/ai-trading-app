# ML Service

Python machine learning service for AI stock recommendations.

## Quick Start

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server runs on `http://localhost:5001`

## Project Structure

```
ml-service/
├── src/
│   ├── models/          # ML model definitions
│   ├── features/        # Feature engineering
│   ├── services/        # ML pipelines
│   ├── utils/           # Helper functions
│   └── config.py        # Configuration
├── data/                # Training data
├── notebooks/           # Jupyter notebooks
├── tests/               # Test files
├── requirements.txt     # Python dependencies
└── app.py               # Flask API
```

## Environment Variables

Create `.env`:

```env
FLASK_ENV=development
PORT=5001
MODEL_PATH=./models/stock_recommender.pkl
LOG_LEVEL=INFO
MARKET_API_KEY=your-api-key
```

## Scripts

```bash
python app.py              # Start Flask server
python train_model.py      # Train recommendation model
python evaluate_model.py   # Evaluate model performance
pytest                     # Run tests
black .                    # Format code
flake8 .                   # Lint code
```

## API Endpoints

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/recommendations/retrain` - Trigger model retraining
- `GET /api/recommendations/performance` - Get model performance metrics

### Health
- `GET /health` - Service health check

## Model Architecture

### Stock Recommendation Model

**Algorithm**: Ensemble of Random Forest + Gradient Boosting

**Features**:
- Technical indicators (RSI, MACD, Bollinger Bands)
- Fundamental metrics (P/E ratio, dividend yield, growth rate)
- Sentiment analysis (news sentiment, social media)
- Market conditions (volatility, sector performance)
- User preferences & history

**Output**:
- Stock symbol
- Confidence score (0-100)
- Reasoning (top 3 factors)
- Risk level (low/medium/high)

## Feature Engineering

```python
# src/features/technical_indicators.py
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Moving Averages (20, 50, 200 day)
- Volume indicators

# src/features/fundamental.py
- P/E Ratio
- PEG Ratio
- Debt-to-Equity
- ROE (Return on Equity)
- Dividend Yield
- 52-week high/low

# src/features/sentiment.py
- News sentiment score
- Social media mentions
- Analyst ratings
```

## Model Training

### Data Collection
```python
# Collect historical data from market APIs
# Process and engineer features
# Split into train/test sets
```

### Training Pipeline
```python
from src.models.recommender import RecommendationModel

model = RecommendationModel()
model.train(X_train, y_train)
model.evaluate(X_test, y_test)
model.save('./models/stock_recommender.pkl')
```

### Hyperparameter Tuning
```python
# GridSearchCV for optimal parameters
# Cross-validation for robustness
# Track experiments with MLflow
```

## Predictions

```python
from src.models.recommender import RecommendationModel

model = RecommendationModel.load('./models/stock_recommender.pkl')

recommendations = model.predict(
    user_id='user123',
    risk_tolerance='medium',
    investment_amount=5000,
    sectors=['tech', 'healthcare']
)

# Output:
# [
#   {
#     "symbol": "AAPL",
#     "confidence": 0.85,
#     "reasoning": ["Strong fundamental", "Positive sentiment", "Breakout pattern"],
#     "risk_level": "medium",
#     "predicted_return": 0.12
#   },
#   ...
# ]
```

## Model Performance

**Metrics Tracked**:
- Accuracy
- Precision & Recall
- F1 Score
- ROC-AUC
- Sharpe Ratio (for investment returns)
- Win Rate (% of profitable recommendations)

```
Model Performance:
- Training Accuracy: 78.5%
- Test Accuracy: 76.2%
- Win Rate: 72.1%
- Sharpe Ratio: 1.45
```

## Data Sources

- **Market Data**: Alpha Vantage, IEX Cloud, Yahoo Finance
- **News Sentiment**: NewsAPI, Twitter API
- **Fundamentals**: IEX Cloud, Financial Modeling Prep
- **Social Media**: Twitter, StockTwits

## Retraining Schedule

- **Daily**: Update with latest market data
- **Weekly**: Retrain model with new features
- **Monthly**: Full model evaluation and hyperparameter tuning
- **Quarterly**: Major model updates and strategy reviews

## Monitoring

```python
# Monitor predictions vs actual outcomes
# Track model drift
# Alert on performance degradation
# Log all predictions for analysis
```

## Dependencies

```
pandas            # Data manipulation
numpy             # Numerical computing
scikit-learn      # ML algorithms
tensorflow        # Deep learning (optional)
flask             # Web framework
flask-cors        # CORS support
python-dotenv     # Environment variables
requests          # HTTP client
pytest            # Testing
black             # Code formatting
flake8            # Linting
```

## Testing

```bash
pytest                    # Run all tests
pytest tests/test_models.py  # Test specific file
pytest -v                 # Verbose output
pytest --cov              # Coverage report
```

## Notebooks

Jupyter notebooks for exploration and experimentation:

```bash
jupyter notebook

# notebooks/
# ├── 01_data_exploration.ipynb
# ├── 02_feature_engineering.ipynb
# ├── 03_model_training.ipynb
# └── 04_analysis.ipynb
```

## Performance Optimization

- **Caching**: Cache predictions for recent stocks
- **Batch Processing**: Process multiple users efficiently
- **Model Compression**: Quantize model for faster inference
- **Async Jobs**: Use Celery for long-running tasks

## Limitations & Disclaimers

⚠️ **Important**:
- Model based on historical data; past performance ≠ future results
- Not financial advice; always consult professional advisors
- Market conditions change; model needs regular updates
- Consider model predictions as one input among many

## Further Resources

- [scikit-learn documentation](https://scikit-learn.org/)
- [Pandas documentation](https://pandas.pydata.org/)
- [Feature Engineering Best Practices](https://machinelearningmastery.com/)
- [Time Series Forecasting](https://www.tensorflow.org/tutorials/structured_data/time_series)

## Development

Local development setup:

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
FLASK_ENV=development python app.py

# Run tests
pytest

# Format code
black .
flake8 .
```
