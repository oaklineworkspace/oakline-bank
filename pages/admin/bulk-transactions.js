
import { useState } from 'react';

export default function BulkTransactions() {
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvData.trim()) {
      alert('Please enter CSV data');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/admin/bulk-transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData }),
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
      setResults({ error: 'Failed to process bulk transactions' });
    } finally {
      setLoading(false);
    }
  };

  const sampleCsv = `email,account_number,type,amount,description
user@example.com,1234567890,deposit,500.00,Initial deposit
user@example.com,1234567890,withdrawal,50.00,ATM withdrawal
user2@example.com,0987654321,interest,25.50,Monthly interest`;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bulk Transaction Upload</h1>
      
      <div style={styles.instructions}>
        <h3>CSV Format Instructions:</h3>
        <p>Use the following format (header row required):</p>
        <pre style={styles.sampleCsv}>{sampleCsv}</pre>
        <ul>
          <li><strong>email:</strong> User's email address</li>
          <li><strong>account_number:</strong> Target account number</li>
          <li><strong>type:</strong> deposit, withdrawal, fee, interest, bonus, refund, adjustment</li>
          <li><strong>amount:</strong> Positive number (system will handle sign based on type)</li>
          <li><strong>description:</strong> Transaction description</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>CSV Data:</label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            style={styles.textarea}
            placeholder="Paste your CSV data here..."
            rows={10}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#ccc' : '#007bff'
          }}
        >
          {loading ? 'Processing...' : 'Process Bulk Transactions'}
        </button>
      </form>

      {results && (
        <div style={styles.results}>
          <h3>Results:</h3>
          {results.error ? (
            <div style={styles.error}>{results.error}</div>
          ) : (
            <div>
              <p><strong>Total Processed:</strong> {results.total}</p>
              <p><strong>Successful:</strong> {results.successful}</p>
              <p><strong>Failed:</strong> {results.failed}</p>
              
              {results.errors && results.errors.length > 0 && (
                <div>
                  <h4>Errors:</h4>
                  <ul style={styles.errorList}>
                    {results.errors.map((error, index) => (
                      <li key={index} style={styles.errorItem}>
                        Row {error.row}: {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: '30px'
  },
  instructions: {
    backgroundColor: '#f0f8ff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  sampleCsv: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    overflow: 'auto'
  },
  form: {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  results: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  error: {
    color: '#c62828',
    backgroundColor: '#ffebee',
    padding: '10px',
    borderRadius: '4px'
  },
  errorList: {
    backgroundColor: '#ffebee',
    padding: '10px',
    borderRadius: '4px'
  },
  errorItem: {
    color: '#c62828',
    marginBottom: '5px'
  }
};
