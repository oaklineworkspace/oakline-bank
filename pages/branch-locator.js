
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function BranchLocator() {
  const [user, setUser] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);

  useEffect(() => {
    checkUser();
    setFilteredBranches(branches);
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const branches = [
    {
      id: 1,
      name: 'Manhattan Financial Center',
      address: '123 Financial District, New York, NY 10005',
      phone: '(212) 555-0123',
      hours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-2PM',
      services: ['Full Service', 'Investment Services', 'Safe Deposit Boxes', 'Notary'],
      type: 'Full Service Branch'
    },
    {
      id: 2,
      name: 'Brooklyn Heights Branch',
      address: '456 Montague Street, Brooklyn, NY 11201',
      phone: '(718) 555-0456',
      hours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
      services: ['Full Service', 'ATM', 'Safe Deposit Boxes'],
      type: 'Community Branch'
    },
    {
      id: 3,
      name: 'Los Angeles Downtown',
      address: '789 Wilshire Blvd, Los Angeles, CA 90017',
      phone: '(213) 555-0789',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 9AM-3PM',
      services: ['Full Service', 'Investment Services', 'Business Banking', 'ATM'],
      type: 'Full Service Branch'
    },
    {
      id: 4,
      name: 'Chicago Loop Center',
      address: '321 LaSalle Street, Chicago, IL 60604',
      phone: '(312) 555-0321',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      services: ['Full Service', 'Investment Services', 'Safe Deposit Boxes', 'Business Banking'],
      type: 'Full Service Branch'
    },
    {
      id: 5,
      name: 'Miami Brickell Branch',
      address: '654 Brickell Avenue, Miami, FL 33131',
      phone: '(305) 555-0654',
      hours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
      services: ['Full Service', 'International Banking', 'ATM'],
      type: 'International Branch'
    },
    {
      id: 6,
      name: 'Boston Financial District',
      address: '987 Federal Street, Boston, MA 02110',
      phone: '(617) 555-0987',
      hours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-2PM',
      services: ['Full Service', 'Investment Services', 'Safe Deposit Boxes'],
      type: 'Full Service Branch'
    }
  ];

  const states = ['All States', 'NY', 'CA', 'IL', 'FL', 'MA'];

  const handleStateFilter = (state) => {
    setSelectedState(state);
    if (state === 'All States' || state === '') {
      setFilteredBranches(branches);
    } else {
      const filtered = branches.filter(branch => 
        branch.address.includes(`, ${state} `)
      );
      setFilteredBranches(filtered);
    }
  };

  const handleZipSearch = (zip) => {
    setSearchZip(zip);
    if (zip === '') {
      setFilteredBranches(branches);
    } else {
      const filtered = branches.filter(branch => 
        branch.address.includes(zip)
      );
      setFilteredBranches(filtered);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logoContainer}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
            <div style={styles.brandInfo}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.tagline}>Your Financial Partner</span>
            </div>
          </Link>
          
          <div style={styles.headerActions}>
            <Link href="/" style={styles.headerButton}>Home</Link>
            {user ? (
              <Link href="/dashboard" style={styles.headerButton}>Dashboard</Link>
            ) : (
              <Link href="/login" style={styles.headerButton}>Sign In</Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find a Branch or ATM</h1>
          <p style={styles.heroSubtitle}>
            Locate Oakline Bank branches and ATMs near you for all your banking needs
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Search Section */}
        <section style={styles.searchSection}>
          <div style={styles.searchContent}>
            <h2 style={styles.searchTitle}>Search by Location</h2>
            
            <div style={styles.searchControls}>
              <div style={styles.searchGroup}>
                <label style={styles.searchLabel}>Search by ZIP Code</label>
                <input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={searchZip}
                  onChange={(e) => handleZipSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              
              <div style={styles.searchGroup}>
                <label style={styles.searchLabel}>Filter by State</label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateFilter(e.target.value)}
                  style={styles.searchSelect}
                >
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={styles.searchStats}>
              <span style={styles.statsText}>
                {filteredBranches.length} location{filteredBranches.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </section>

        {/* ATM Network Info */}
        <section style={styles.atmSection}>
          <div style={styles.atmContent}>
            <h2 style={styles.atmTitle}>ATM Network</h2>
            <div style={styles.atmGrid}>
              <div style={styles.atmCard}>
                <div style={styles.atmIcon}>🏧</div>
                <h3 style={styles.atmCardTitle}>55,000+ ATMs</h3>
                <p style={styles.atmCardText}>Access your money at over 55,000 fee-free ATMs nationwide</p>
              </div>
              
              <div style={styles.atmCard}>
                <div style={styles.atmIcon}>🌍</div>
                <h3 style={styles.atmCardTitle}>International Access</h3>
                <p style={styles.atmCardText}>Use your card at ATMs worldwide with competitive exchange rates</p>
              </div>
              
              <div style={styles.atmCard}>
                <div style={styles.atmIcon}>💰</div>
                <h3 style={styles.atmCardTitle}>No Fees</h3>
                <p style={styles.atmCardText}>Free ATM access for all Oakline Bank customers at network locations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Branch Listings */}
        <section style={styles.branchSection}>
          <div style={styles.branchContent}>
            <h2 style={styles.branchTitle}>Branch Locations</h2>
            
            <div style={styles.branchList}>
              {filteredBranches.map(branch => (
                <div key={branch.id} style={styles.branchCard}>
                  <div style={styles.branchHeader}>
                    <h3 style={styles.branchName}>{branch.name}</h3>
                    <span style={styles.branchType}>{branch.type}</span>
                  </div>
                  
                  <div style={styles.branchDetails}>
                    <div style={styles.branchInfo}>
                      <div style={styles.infoItem}>
                        <span style={styles.infoIcon}>📍</span>
                        <span style={styles.infoText}>{branch.address}</span>
                      </div>
                      
                      <div style={styles.infoItem}>
                        <span style={styles.infoIcon}>📞</span>
                        <a href={`tel:${branch.phone}`} style={styles.phoneLink}>{branch.phone}</a>
                      </div>
                      
                      <div style={styles.infoItem}>
                        <span style={styles.infoIcon}>🕒</span>
                        <span style={styles.infoText}>{branch.hours}</span>
                      </div>
                    </div>
                    
                    <div style={styles.branchServices}>
                      <h4 style={styles.servicesTitle}>Services Available:</h4>
                      <div style={styles.servicesList}>
                        {branch.services.map((service, index) => (
                          <span key={index} style={styles.serviceTag}>{service}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.branchActions}>
                    <button style={styles.directionsButton}>
                      📍 Get Directions
                    </button>
                    <button style={styles.callButton}>
                      📞 Call Branch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Info */}
        <section style={styles.servicesSection}>
          <div style={styles.servicesContent}>
            <h2 style={styles.servicesTitle}>Branch Services</h2>
            <div style={styles.servicesGrid}>
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>🏦</div>
                <h3 style={styles.serviceCardTitle}>Full Service Banking</h3>
                <p style={styles.serviceCardText}>All account services, loans, deposits, and customer support</p>
              </div>
              
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>📈</div>
                <h3 style={styles.serviceCardTitle}>Investment Services</h3>
                <p style={styles.serviceCardText}>Financial planning, investment accounts, and wealth management</p>
              </div>
              
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>🏢</div>
                <h3 style={styles.serviceCardTitle}>Business Banking</h3>
                <p style={styles.serviceCardText">Commercial accounts, business loans, and merchant services</p>
              </div>
              
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>🔒</div>
                <h3 style={styles.serviceCardTitle}>Safe Deposit Boxes</h3>
                <p style={styles.serviceCardText}>Secure storage for important documents and valuables</p>
              </div>
              
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>📝</div>
                <h3 style={styles.serviceCardTitle}>Notary Services</h3>
                <p style={styles.serviceCardText}>Document notarization and authentication services</p>
              </div>
              
              <div style={styles.serviceCard}>
                <div style={styles.serviceIcon}>🌍</div>
                <h3 style={styles.serviceCardTitle}>International Banking</h3>
                <p style={styles.serviceCardText}>Foreign exchange, international transfers, and global services</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            © 2024 Oakline Bank. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'white'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  tagline: {
    fontSize: '0.9rem',
    color: '#bfdbfe'
  },
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  headerButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    padding: '3rem 1.5rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  searchSection: {
    padding: '2rem 0'
  },
  searchContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  searchTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  searchControls: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1rem'
  },
  searchGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  searchLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151'
  },
  searchInput: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  searchSelect: {
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  searchStats: {
    textAlign: 'center',
    padding: '1rem 0'
  },
  statsText: {
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  atmSection: {
    padding: '2rem 0'
  },
  atmContent: {
    textAlign: 'center'
  },
  atmTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  atmGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  atmCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  atmIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  atmCardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '0.5rem'
  },
  atmCardText: {
    color: '#64748b',
    lineHeight: '1.5'
  },
  branchSection: {
    padding: '2rem 0'
  },
  branchContent: {},
  branchTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  branchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  branchCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  branchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  branchName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  branchType: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  branchDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  branchInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  infoIcon: {
    fontSize: '1rem',
    minWidth: '20px'
  },
  infoText: {
    color: '#64748b',
    fontSize: '0.9rem'
  },
  phoneLink: {
    color: '#1e40af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  branchServices: {},
  servicesTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.75rem'
  },
  servicesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  serviceTag: {
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  branchActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  directionsButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  callButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: '#1e40af',
    border: '2px solid #1e40af',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  servicesSection: {
    padding: '3rem 0'
  },
  servicesContent: {
    textAlign: 'center'
  },
  servicesTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  serviceIcon: {
    fontSize: '2rem',
    marginBottom: '1rem'
  },
  serviceCardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  serviceCardText: {
    color: '#64748b',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  footer: {
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '2rem 1.5rem',
    textAlign: 'center'
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  footerText: {
    color: '#d1d5db',
    fontSize: '0.9rem'
  }
};
