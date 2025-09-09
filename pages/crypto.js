
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Crypto() {
  const [user, setUser] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      // Add your auth check logic here
    };
    
    checkAuth();
    fetchCryptoData();
    fetchPortfolio();
  }, []);

  const fetchCryptoData = () => {
    // Mock crypto data - in real app, fetch from API
    setCryptoData([
      { symbol: 'BTC', name: 'Bitcoin', price: 67350.00, change: '+2.45%', changeValue: 1604.25, icon: '₿' },
      { symbol: 'ETH', name: 'Ethereum', price: 3245.80, change: '+1.87%', changeValue: 59.62, icon: 'Ξ' },
      { symbol: 'ADA', name: 'Cardano', price: 0.485, change: '-0.92%', changeValue: -0.0045, icon: '₳' },
      { symbol: 'DOT', name: 'Polkadot', price: 7.23, change: '+3.21%', changeValue: 0.225, icon: '●' },
      { symbol: 'LINK', name: 'Chainlink', price: 14.67, change: '+5.44%', changeValue: 0.758, icon: '🔗' },
      { symbol: 'SOL', name: 'Solana', price: 178.45, change: '+7.33%', changeValue: 12.20, icon: '◎' }
    ]);
  };

  const fetchPortfolio = () => {
    // Mock portfolio data
    setPortfolio([
      { symbol: 'BTC', amount: 0.25, value: 16837.50, profit: '+$2,450.00' },
      { symbol: 'ETH', amount: 2.5, value: 8114.50, profit: '+$1,120.00' },
      { symbol: 'ADA', amount: 1000, value: 485.00, profit: '-$85.00' }
    ]);
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add your trading logic here
      setMessage(`${action.toUpperCase()} order for ${amount} ${selectedCrypto} submitted successfully!`);
      setAmount('');
      setSelectedCrypto('');
      
      // Refresh portfolio
      fetchPortfolio();
    } catch (error) {
      setMessage('Error processing trade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>₿ Crypto Trading</h1>
          <p style={styles.subtitle}>Trade cryptocurrencies with Oakline Bank</p>
        </div>
        <Link href="/main-menu" style={styles.backButton}>
          ← Back to Menu
        </Link>
      </div>

      {/* Portfolio Overview */}
      <div style={styles.portfolioSection}>
        <h2 style={styles.sectionTitle}>📊 Your Portfolio</h2>
        <div style={styles.portfolioGrid}>
          <div style={styles.portfolioCard}>
            <h3>Total Value</h3>
            <p style={styles.totalValue}>$25,437.00</p>
            <span style={styles.profitIndicator}>+$3,485.00 (+15.9%)</span>
          </div>
          <div style={styles.portfolioCard}>
            <h3>24h Change</h3>
            <p style={styles.changeValue}>+$847.25</p>
            <span style={styles.profitIndicator}>+3.44%</span>
          </div>
          <div style={styles.portfolioCard}>
            <h3>Holdings</h3>
            <p style={styles.holdingsCount}>3 Cryptocurrencies</p>
            <span style={styles.diversification}>Well Diversified</span>
          </div>
        </div>
      </div>

      {/* Live Prices */}
      <div style={styles.pricesSection}>
        <h2 style={styles.sectionTitle}>💹 Live Prices</h2>
        <div style={styles.cryptoGrid}>
          {cryptoData.map((crypto) => (
            <div key={crypto.symbol} style={styles.cryptoCard}>
              <div style={styles.cryptoHeader}>
                <span style={styles.cryptoIcon}>{crypto.icon}</span>
                <div>
                  <h3 style={styles.cryptoSymbol}>{crypto.symbol}</h3>
                  <p style={styles.cryptoName}>{crypto.name}</p>
                </div>
              </div>
              <div style={styles.cryptoPrice}>
                <p style={styles.price}>${crypto.price.toLocaleString()}</p>
                <span style={crypto.change.startsWith('+') ? styles.positive : styles.negative}>
                  {crypto.change}
                </span>
              </div>
              <button 
                style={styles.tradeButton}
                onClick={() => setSelectedCrypto(crypto.symbol)}
              >
                Trade
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Panel */}
      <div style={styles.tradingSection}>
        <h2 style={styles.sectionTitle}>💰 Trade Crypto</h2>
        <form onSubmit={handleTrade} style={styles.tradingForm}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Action</label>
              <select 
                value={action} 
                onChange={(e) => setAction(e.target.value)}
                style={styles.select}
              >
                <option value="buy">🟢 Buy</option>
                <option value="sell">🔴 Sell</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cryptocurrency</label>
              <select 
                value={selectedCrypto} 
                onChange={(e) => setSelectedCrypto(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Select Crypto</option>
                {cryptoData.map((crypto) => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
              placeholder="Enter amount"
              min="10"
              step="0.01"
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : `${action.toUpperCase()} ${selectedCrypto || 'Crypto'}`}
          </button>
        </form>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}
      </div>

      {/* Holdings */}
      <div style={styles.holdingsSection}>
        <h2 style={styles.sectionTitle}>💼 Your Holdings</h2>
        <div style={styles.holdingsGrid}>
          {portfolio.map((holding) => (
            <div key={holding.symbol} style={styles.holdingCard}>
              <div style={styles.holdingHeader}>
                <h3>{holding.symbol}</h3>
                <span style={holding.profit.startsWith('+') ? styles.positive : styles.negative}>
                  {holding.profit}
                </span>
              </div>
              <p style={styles.holdingAmount}>{holding.amount} {holding.symbol}</p>
              <p style={styles.holdingValue}>${holding.value.toLocaleString()}</p>
              <div style={styles.holdingActions}>
                <button style={styles.buyButton}>Buy More</button>
                <button style={styles.sellButton}>Sell</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <Link href="/dashboard" style={styles.actionButton}>
          📊 Dashboard
        </Link>
        <Link href="/transactions" style={styles.actionButton}>
          📋 Transaction History
        </Link>
        <Link href="/profile" style={styles.actionButton}>
          👤 Profile
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    margin: '5px 0 0 0'
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)'
  },
  portfolioSection: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px'
  },
  portfolioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  portfolioCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)'
  },
  totalValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4ade80',
    margin: '10px 0'
  },
  changeValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4ade80',
    margin: '10px 0'
  },
  holdingsCount: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    margin: '10px 0'
  },
  profitIndicator: {
    color: '#4ade80',
    fontSize: '14px',
    fontWeight: '500'
  },
  diversification: {
    color: '#60a5fa',
    fontSize: '14px'
  },
  pricesSection: {
    marginBottom: '30px'
  },
  cryptoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  cryptoCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  cryptoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  cryptoIcon: {
    fontSize: '24px'
  },
  cryptoSymbol: {
    color: 'white',
    margin: 0,
    fontSize: '18px'
  },
  cryptoName: {
    color: 'rgba(255,255,255,0.7)',
    margin: '2px 0 0 0',
    fontSize: '14px'
  },
  cryptoPrice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  price: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0
  },
  positive: {
    color: '#4ade80',
    fontWeight: '500'
  },
  negative: {
    color: '#f87171',
    fontWeight: '500'
  },
  tradeButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  tradingSection: {
    background: 'rgba(255,255,255,0.1)',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    backdropFilter: 'blur(10px)'
  },
  tradingForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500'
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.9)'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.9)'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  message: {
    background: 'rgba(74, 222, 128, 0.2)',
    color: '#4ade80',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    marginTop: '20px'
  },
  holdingsSection: {
    marginBottom: '30px'
  },
  holdingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  holdingCard: {
    background: 'rgba(255,255,255,0.1)',
    padding: '20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },
  holdingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  holdingAmount: {
    color: 'rgba(255,255,255,0.8)',
    margin: '5px 0'
  },
  holdingValue: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '5px 0 15px 0'
  },
  holdingActions: {
    display: 'flex',
    gap: '10px'
  },
  buyButton: {
    flex: 1,
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  sellButton: {
    flex: 1,
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  quickActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  actionButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    backdropFilter: 'blur(10px)'
  }
};
