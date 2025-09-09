
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Loans() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLoanType, setSelectedLoanType] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    income: '',
    employment: '',
    creditScore: ''
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loanTypes = [
    {
      id: 'personal',
      title: 'Personal Loan',
      icon: '💰',
      rate: '5.99% - 24.99%',
      amount: '$1,000 - $50,000',
      term: '2 - 7 years',
      description: 'Flexible personal loans for any purpose',
      features: ['No collateral required', 'Fixed interest rates', 'Quick approval']
    },
    {
      id: 'home',
      title: 'Home Mortgage',
      icon: '🏠',
      rate: '3.25% - 7.50%',
      amount: '$50,000 - $2,000,000',
      term: '15 - 30 years',
      description: 'Buy your dream home with competitive rates',
      features: ['Low down payment options', 'Fixed & adjustable rates', 'First-time buyer programs']
    },
    {
      id: 'auto',
      title: 'Auto Loan',
      icon: '🚗',
      rate: '2.99% - 18.99%',
      amount: '$5,000 - $150,000',
      term: '2 - 8 years',
      description: 'Finance your new or used vehicle',
      features: ['New & used car financing', 'Pre-approval available', 'No prepayment penalties']
    },
    {
      id: 'business',
      title: 'Business Loan',
      icon: '🏢',
      rate: '4.50% - 25.00%',
      amount: '$10,000 - $500,000',
      term: '1 - 10 years',
      description: 'Grow your business with our financing',
      features: ['Working capital', 'Equipment financing', 'SBA loans available']
    },
    {
      id: 'student',
      title: 'Student Loan',
      icon: '🎓',
      rate: '3.73% - 14.50%',
      amount: 'Up to cost of attendance',
      term: '5 - 20 years',
      description: 'Invest in your education and future',
      features: ['Undergraduate & graduate', 'Deferment options', 'Competitive rates']
    },
    {
      id: 'line_of_credit',
      title: 'Line of Credit',
      icon: '💳',
      rate: '7.25% - 25.00%',
      amount: '$5,000 - $100,000',
      term: 'Revolving credit',
      description: 'Access funds when you need them',
      features: ['Pay interest only on what you use', 'Revolving credit line', 'Online access']
    }
  ];

  const handleLoanApplication = (loanType) => {
    setSelectedLoanType(loanType);
    setApplicationData({ ...applicationData, loanType: loanType.id });
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    // Here you would typically send the application to your backend
    console.log('Loan application submitted:', applicationData);
    setShowApplicationModal(false);
    alert('Loan application submitted successfully! We will contact you within 24 hours.');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <h1 style={styles.title}>Loans & Credit</h1>
          <button 
            style={styles.menuButton}
            onClick={() => router.push('/main-menu')}
          >
            ☰
          </button>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.backButton}
            onClick={() => router.push('/dashboard')}
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h2 style={styles.heroTitle}>Get the Financing You Need</h2>
        <p style={styles.heroSubtitle}>
          Competitive rates, flexible terms, and quick approvals for all your financial goals
        </p>
      </div>

      {/* Loan Calculator */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Quick Loan Calculator</h3>
        <div style={styles.calculatorGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Loan Amount</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder="$25,000"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Interest Rate (%)</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder="5.99"
              step="0.01"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Term (Years)</label>
            <input 
              type="number" 
              style={styles.input} 
              placeholder="5"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Monthly Payment</label>
            <div style={styles.calculatedAmount}>$478.22</div>
          </div>
        </div>
      </div>

      {/* Loan Types Grid */}
      <div style={styles.loansGrid}>
        {loanTypes.map(loan => (
          <div key={loan.id} style={styles.loanCard}>
            <div style={styles.loanHeader}>
              <span style={styles.loanIcon}>{loan.icon}</span>
              <h3 style={styles.loanTitle}>{loan.title}</h3>
            </div>
            
            <p style={styles.loanDescription}>{loan.description}</p>
            
            <div style={styles.loanDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Interest Rate:</span>
                <span style={styles.detailValue}>{loan.rate}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Loan Amount:</span>
                <span style={styles.detailValue}>{loan.amount}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Term:</span>
                <span style={styles.detailValue}>{loan.term}</span>
              </div>
            </div>

            <div style={styles.loanFeatures}>
              {loan.features.map((feature, index) => (
                <div key={index} style={styles.feature}>
                  <span style={styles.featureIcon}>✓</span>
                  <span style={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              style={styles.applyButton}
              onClick={() => handleLoanApplication(loan)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div style={styles.modal} onClick={() => setShowApplicationModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Apply for {selectedLoanType.title}</h3>
            <form onSubmit={handleSubmitApplication}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Requested Amount</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={applicationData.amount}
                    onChange={e => setApplicationData({...applicationData, amount: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Purpose</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={applicationData.purpose}
                    onChange={e => setApplicationData({...applicationData, purpose: e.target.value})}
                    placeholder="What will you use this loan for?"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Annual Income</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={applicationData.income}
                    onChange={e => setApplicationData({...applicationData, income: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employment Status</label>
                  <select
                    style={styles.input}
                    value={applicationData.employment}
                    onChange={e => setApplicationData({...applicationData, employment: e.target.value})}
                    required
                  >
                    <option value="">Select employment status</option>
                    <option value="full_time">Full-time employed</option>
                    <option value="part_time">Part-time employed</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Credit Score (Optional)</label>
                  <select
                    style={styles.input}
                    value={applicationData.creditScore}
                    onChange={e => setApplicationData({...applicationData, creditScore: e.target.value})}
                  >
                    <option value="">Select range</option>
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good">Good (650-749)</option>
                    <option value="fair">Fair (550-649)</option>
                    <option value="poor">Poor (Below 550)</option>
                    <option value="unknown">Don't know</option>
                  </select>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '15px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0
  },
  menuButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  headerActions: {
    display: 'flex',
    gap: '10px'
  },
  backButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    color: '#64748b'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    color: 'white',
    padding: '30px 15px',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  heroSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0
  },
  card: {
    backgroundColor: 'white',
    margin: '15px',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 15px 0'
  },
  calculatorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px'
  },
  calculatedAmount: {
    padding: '10px',
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center'
  },
  loansGrid: {
    display: 'grid',
    gap: '15px',
    padding: '15px'
  },
  loanCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  loanHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  loanIcon: {
    fontSize: '24px'
  },
  loanTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  loanDescription: {
    color: '#64748b',
    marginBottom: '15px',
    fontSize: '14px'
  },
  loanDetails: {
    marginBottom: '15px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f1f5f9'
  },
  detailLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '13px',
    color: '#1e293b',
    fontWeight: '600'
  },
  loanFeatures: {
    marginBottom: '20px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  featureIcon: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  featureText: {
    fontSize: '13px',
    color: '#374151'
  },
  applyButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '15px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#1e293b'
  },
  formGrid: {
    display: 'grid',
    gap: '15px',
    marginBottom: '20px'
  },
  modalActions: {
    display: 'flex',
    gap: '10px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};
