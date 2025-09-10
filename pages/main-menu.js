
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
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
      await fetchUserData(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (user) => {
    try {
      const { data: profile } = await supabase
        .from('applications')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const bankingServices = [
    {
      category: 'Account Management',
      icon: '🏦',
      color: '#1e40af',
      services: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', desc: 'Account overview and summary' },
        { name: 'Account Details', path: '/account-details', icon: '📋', desc: 'View detailed account information' },
        { name: 'Transaction History', path: '/transactions', icon: '📜', desc: 'Review all transactions' },
        { name: 'Statements', path: '/statements', icon: '📄', desc: 'Download account statements' },
        { name: 'Account Settings', path: '/profile', icon: '⚙️', desc: 'Manage account preferences' }
      ]
    },
    {
      category: 'Money Movement',
      icon: '💸',
      color: '#059669',
      services: [
        { name: 'Transfer Money', path: '/transfer', icon: '🔄', desc: 'Transfer between accounts or to others' },
        { name: 'Mobile Deposit', path: '/deposit-real', icon: '📱', desc: 'Deposit checks with your phone' },
        { name: 'Bill Pay', path: '/bill-pay', icon: '🧾', desc: 'Pay bills online securely' },
        { name: 'Wire Transfer', path: '/wire-transfer', icon: '🌐', desc: 'Send money internationally' },
        { name: 'Scheduled Payments', path: '/scheduled-payments', icon: '📅', desc: 'Set up recurring payments' }
      ]
    },
    {
      category: 'Cards & Digital',
      icon: '💳',
      color: '#7c3aed',
      services: [
        { name: 'Manage Cards', path: '/cards', icon: '💳', desc: 'View and control your cards' },
        { name: 'Card Controls', path: '/card-controls', icon: '🎛️', desc: 'Set spending limits and controls' },
        { name: 'Digital Wallet', path: '/digital-wallet', icon: '📲', desc: 'Mobile payment solutions' },
        { name: 'Card Rewards', path: '/rewards', icon: '🎁', desc: 'Track and redeem rewards' },
        { name: 'Lost/Stolen Card', path: '/card-support', icon: '🚨', desc: 'Report and replace cards' }
      ]
    },
    {
      category: 'Lending & Credit',
      icon: '🏠',
      color: '#dc2626',
      services: [
        { name: 'Apply for Loans', path: '/loans', icon: '📋', desc: 'Personal, auto, and home loans' },
        { name: 'Credit Report', path: '/credit-report', icon: '📊', desc: 'Check your credit score' },
        { name: 'Mortgage Center', path: '/mortgage', icon: '🏠', desc: 'Home financing solutions' },
        { name: 'Auto Loans', path: '/auto-loans', icon: '🚗', desc: 'Vehicle financing options' },
        { name: 'Credit Cards', path: '/credit-cards', icon: '💳', desc: 'Apply for credit cards' }
      ]
    },
    {
      category: 'Investment & Wealth',
      icon: '📈',
      color: '#ea580c',
      services: [
        { name: 'Investment Portfolio', path: '/investments', icon: '💼', desc: 'Manage your investments' },
        { name: 'Retirement Planning', path: '/retirement', icon: '🏖️', desc: 'Plan for your future' },
        { name: 'Cryptocurrency', path: '/crypto', icon: '₿', desc: 'Digital currency trading' },
        { name: 'Financial Advisory', path: '/financial-advisory', icon: '👨‍💼', desc: 'Professional guidance' },
        { name: 'Market Research', path: '/market-news', icon: '📰', desc: 'Latest market insights' }
      ]
    },
    {
      category: 'Support & Security',
      icon: '🛡️',
      color: '#0891b2',
      services: [
        { name: 'Customer Support', path: '/support', icon: '🎧', desc: 'Get help and assistance' },
        { name: 'Security Center', path: '/security', icon: '🔒', desc: 'Account security settings' },
        { name: 'Messages', path: '/messages', icon: '💬', desc: 'Secure bank communications' },
        { name: 'Notifications', path: '/notifications', icon: '🔔', desc: 'Manage alert preferences' },
        { name: 'Help Center', path: '/help', icon: '❓', desc: 'FAQ and tutorials' }
      ]
    }
  ];

  const allServices = bankingServices.flatMap(category => 
    category.services.map(service => ({ ...service, category: category.category }))
  );

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...bankingServices.map(cat => cat.category)];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading menu...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Professional Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerLeft}>
            <Link href="/" style={styles.logoContainer}>
              <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
              <div style={styles.brandInfo}>
                <h1 style={styles.brandName}>Oakline Bank</h1>
                <span style={styles.brandTagline}>Banking Services Menu</span>
              </div>
            </Link>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userSection}>
              <span style={styles.welcomeText}>Welcome, {getUserDisplayName()}</span>
              <div style={styles.headerActions}>
                <Link href="/dashboard" style={styles.headerButton}>
                  <span style={styles.buttonIcon}>📊</span>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  <span style={styles.buttonIcon}>🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Search and Filter Section */}
        <section style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <h2 style={styles.pageTitle}>Banking Services</h2>
            <p style={styles.pageSubtitle}>Access all your banking needs in one place</p>
            
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.categoryFilter}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={{
                    ...styles.categoryButton,
                    ...(activeCategory === category ? styles.activeCategoryButton : {})
                  }}
                >
                  {category === 'all' ? 'All Services' : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section style={styles.quickAccessSection}>
          <h3 style={styles.sectionTitle}>Quick Access</h3>
          <div style={styles.quickAccessGrid}>
            <Link href="/dashboard" style={styles.quickAccessCard}>
              <span style={styles.quickAccessIcon}>📊</span>
              <span style={styles.quickAccessText}>Dashboard</span>
            </Link>
            <Link href="/transfer" style={styles.quickAccessCard}>
              <span style={styles.quickAccessIcon}>💸</span>
              <span style={styles.quickAccessText}>Transfer</span>
            </Link>
            <Link href="/deposit-real" style={styles.quickAccessCard}>
              <span style={styles.quickAccessIcon}>📱</span>
              <span style={styles.quickAccessText}>Deposit</span>
            </Link>
            <Link href="/bill-pay" style={styles.quickAccessCard}>
              <span style={styles.quickAccessIcon}>🧾</span>
              <span style={styles.quickAccessText}>Pay Bills</span>
            </Link>
          </div>
        </section>

        {/* Services by Category */}
        {activeCategory === 'all' ? (
          bankingServices.map(category => (
            <section key={category.category} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <div style={styles.categoryTitleGroup}>
                  <span style={{...styles.categoryIcon, color: category.color}}>{category.icon}</span>
                  <h3 style={styles.categoryTitle}>{category.category}</h3>
                </div>
                <span style={styles.serviceCount}>{category.services.length} services</span>
              </div>
              
              <div style={styles.servicesGrid}>
                {category.services.map(service => (
                  <Link key={service.name} href={service.path} style={styles.serviceCard}>
                    <div style={styles.serviceIcon}>{service.icon}</div>
                    <div style={styles.serviceContent}>
                      <h4 style={styles.serviceName}>{service.name}</h4>
                      <p style={styles.serviceDesc}>{service.desc}</p>
                    </div>
                    <span style={styles.serviceArrow}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section style={styles.categorySection}>
            <div style={styles.categoryHeader}>
              <h3 style={styles.categoryTitle}>
                {activeCategory === 'all' ? 'All Services' : activeCategory}
              </h3>
              <span style={styles.serviceCount}>{filteredServices.length} services</span>
            </div>
            
            <div style={styles.servicesGrid}>
              {filteredServices.map(service => (
                <Link key={service.name} href={service.path} style={styles.serviceCard}>
                  <div style={styles.serviceIcon}>{service.icon}</div>
                  <div style={styles.serviceContent}>
                    <h4 style={styles.serviceName}>{service.name}</h4>
                    <p style={styles.serviceDesc}>{service.desc}</p>
                  </div>
                  <span style={styles.serviceArrow}>→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section style={styles.contactSection}>
          <h3 style={styles.sectionTitle}>Need Help?</h3>
          <div style={styles.contactGrid}>
            <div style={styles.contactCard}>
              <span style={styles.contactIcon}>📞</span>
              <div style={styles.contactInfo}>
                <h4 style={styles.contactTitle}>Phone Support</h4>
                <p style={styles.contactDetail}>1-800-OAKLINE</p>
                <span style={styles.contactHours}>24/7 Available</span>
              </div>
            </div>
            
            <div style={styles.contactCard}>
              <span style={styles.contactIcon}>✉️</span>
              <div style={styles.contactInfo}>
                <h4 style={styles.contactTitle}>Email Support</h4>
                <p style={styles.contactDetail}>support@theoaklinebank.com</p>
                <span style={styles.contactHours}>Response within 24 hours</span>
              </div>
            </div>
            
            <Link href="/support" style={styles.contactCard}>
              <span style={styles.contactIcon}>💬</span>
              <div style={styles.contactInfo}>
                <h4 style={styles.contactTitle}>Live Chat</h4>
                <p style={styles.contactDetail}>Chat with an agent</p>
                <span style={styles.contactHours}>Mon-Fri 9AM-6PM EST</span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #1e40af',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    fontSize: '1rem',
    color: '#64748b'
  },
  header: {
    backgroundColor: '#1e40af',
    borderBottom: '3px solid #1e3a8a',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.15)'
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '80px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
    gap: '1rem'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  brandInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white'
  },
  brandTagline: {
    fontSize: '0.9rem',
    color: '#bfdbfe',
    fontWeight: '500'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  welcomeText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: 'white'
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem'
  },
  headerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  buttonIcon: {
    fontSize: '0.9rem'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  searchContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem'
  },
  searchBar: {
    position: 'relative',
    marginBottom: '1.5rem'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
    color: '#64748b'
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  categoryFilter: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  categoryButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  activeCategoryButton: {
    backgroundColor: '#1e40af',
    color: 'white',
    borderColor: '#1e40af'
  },
  quickAccessSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 1rem 0'
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  quickAccessCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    textDecoration: 'none',
    color: '#374151',
    transition: 'all 0.2s'
  },
  quickAccessIcon: {
    fontSize: '1.5rem'
  },
  quickAccessText: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  categorySection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9'
  },
  categoryTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  categoryIcon: {
    fontSize: '1.5rem'
  },
  categoryTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  serviceCount: {
    fontSize: '0.8rem',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontWeight: '500'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem'
  },
  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '2px solid #e2e8f0',
    textDecoration: 'none',
    color: '#374151',
    transition: 'all 0.2s'
  },
  serviceIcon: {
    fontSize: '1.5rem',
    padding: '0.75rem',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    minWidth: '50px',
    textAlign: 'center'
  },
  serviceContent: {
    flex: 1
  },
  serviceName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0'
  },
  serviceDesc: {
    fontSize: '0.85rem',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4'
  },
  serviceArrow: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    fontWeight: 'bold'
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s'
  },
  contactIcon: {
    fontSize: '1.5rem',
    padding: '0.75rem',
    backgroundColor: '#eff6ff',
    borderRadius: '8px'
  },
  contactInfo: {
    flex: 1
  },
  contactTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 0.25rem 0'
  },
  contactDetail: {
    fontSize: '0.9rem',
    color: '#1e40af',
    fontWeight: '500',
    margin: '0 0 0.25rem 0'
  },
  contactHours: {
    fontSize: '0.8rem',
    color: '#64748b'
  }
};
