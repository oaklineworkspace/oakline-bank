
import { useState } from 'react';
import Link from 'next/link';
import MainMenu from '../components/MainMenu';
import Footer from '../components/Footer';

export default function BranchLocator() {
  const [user, setUser] = useState(null);
  const [searchZip, setSearchZip] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const branchData = [
    {
      id: 1,
      name: 'Downtown Main Branch',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '(555) 123-4567',
      hours: {
        weekday: '9:00 AM - 5:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
      },
      services: ['Full Service', 'ATM', 'Drive-Through', 'Safe Deposit Boxes', 'Notary'],
      manager: 'Jennifer Smith'
    },
    {
      id: 2,
      name: 'Westside Community Branch',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      phone: '(555) 234-5678',
      hours: {
        weekday: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 3:00 PM',
        sunday: 'Closed'
      },
      services: ['Full Service', 'ATM', 'Business Banking', 'Investment Services'],
      manager: 'Michael Rodriguez'
    },
    {
      id: 3,
      name: 'Suburban Plaza Branch',
      address: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '(555) 345-6789',
      hours: {
        weekday: '8:30 AM - 5:30 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      services: ['Full Service', 'ATM', 'Drive-Through', 'Mortgage Services'],
      manager: 'Sarah Johnson'
    },
    {
      id: 4,
      name: 'Tech District Branch',
      address: '321 Innovation Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      phone: '(555) 456-7890',
      hours: {
        weekday: '9:00 AM - 5:00 PM',
        saturday: '10:00 AM - 2:00 PM',
        sunday: 'Closed'
      },
      services: ['Full Service', 'ATM', 'Business Banking', 'Digital Services'],
      manager: 'David Chen'
    },
    {
      id: 5,
      name: 'Riverside Branch',
      address: '654 River Street',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      phone: '(555) 567-8901',
      hours: {
        weekday: '9:00 AM - 4:00 PM',
        saturday: '9:00 AM - 12:00 PM',
        sunday: 'Closed'
      },
      services: ['Full Service', 'ATM', 'International Banking', 'Safe Deposit Boxes'],
      manager: 'Maria Garcia'
    }
  ];

  const states = ['', 'CA', 'FL', 'IL', 'NY', 'TX'];

  const handleSearch = () => {
    let results = branchData;
    
    if (searchZip) {
      results = results.filter(branch => 
        branch.zip.includes(searchZip) || 
        branch.city.toLowerCase().includes(searchZip.toLowerCase())
      );
    }
    
    if (selectedState) {
      results = results.filter(branch => branch.state === selectedState);
    }
    
    setSearchResults(results);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: '900',
      color: '#1e293b',
      marginBottom: '1rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#64748b',
      maxWidth: '600px',
      margin: '0 auto'
    },
    searchSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2.5rem',
      marginBottom: '3rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    searchTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '2rem',
      textAlign: 'center'
    },
    searchForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      alignItems: 'end'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#374151'
    },
    input: {
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.3s ease'
    },
    select: {
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    searchButton: {
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    resultsSection: {
      marginBottom: '2rem'
    },
    resultsHeader: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '1.5rem'
    },
    branchGrid: {
      display: 'grid',
      gap: '1.5rem'
    },
    branchCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    branchHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem'
    },
    branchName: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    branchAddress: {
      fontSize: '0.95rem',
      color: '#64748b',
      lineHeight: '1.5'
    },
    branchPhone: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#3b82f6',
      textDecoration: 'none'
    },
    branchDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem'
    },
    detailSection: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    detailTitle: {
      fontSize: '0.9rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    detailText: {
      fontSize: '0.85rem',
      color: '#374151',
      lineHeight: '1.4',
      marginBottom: '0.25rem'
    },
    servicesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    serviceTag: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    directionsButton: {
      marginTop: '1rem',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.container}>
      <MainMenu user={user} />
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Find a Branch</h1>
          <p style={styles.subtitle}>
            Locate Oakline Bank branches and ATMs near you. Visit us for 
            personalized banking services and expert financial guidance.
          </p>
        </div>

        <div style={styles.searchSection}>
          <h2 style={styles.searchTitle}>Search for Branches</h2>
          <div style={styles.searchForm}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ZIP Code or City</label>
              <input
                type="text"
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                placeholder="Enter ZIP or city name"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={styles.select}
              >
                <option value="">All States</option>
                {states.slice(1).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSearch} style={styles.searchButton}>
              🔍 Find Branches
            </button>
          </div>
        </div>

        <div style={styles.resultsSection}>
          <h2 style={styles.resultsHeader}>
            {searchResults.length > 0 
              ? `Found ${searchResults.length} Branch${searchResults.length === 1 ? '' : 'es'}`
              : 'All Oakline Bank Locations'
            }
          </h2>
          
          <div style={styles.branchGrid}>
            {(searchResults.length > 0 ? searchResults : branchData).map((branch) => (
              <div key={branch.id} style={styles.branchCard}>
                <div style={styles.branchHeader}>
                  <div>
                    <h3 style={styles.branchName}>{branch.name}</h3>
                    <div style={styles.branchAddress}>
                      {branch.address}<br />
                      {branch.city}, {branch.state} {branch.zip}
                    </div>
                  </div>
                  <a href={`tel:${branch.phone}`} style={styles.branchPhone}>
                    {branch.phone}
                  </a>
                </div>

                <div style={styles.branchDetails}>
                  <div style={styles.detailSection}>
                    <div style={styles.detailTitle}>Hours</div>
                    <div style={styles.detailText}>Mon-Fri: {branch.hours.weekday}</div>
                    <div style={styles.detailText}>Saturday: {branch.hours.saturday}</div>
                    <div style={styles.detailText}>Sunday: {branch.hours.sunday}</div>
                  </div>

                  <div style={styles.detailSection}>
                    <div style={styles.detailTitle}>Services</div>
                    <div style={styles.servicesList}>
                      {branch.services.map((service, index) => (
                        <span key={index} style={styles.serviceTag}>{service}</span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.detailSection}>
                    <div style={styles.detailTitle}>Branch Manager</div>
                    <div style={styles.detailText}>{branch.manager}</div>
                    <a 
                      href={`https://maps.google.com?q=${encodeURIComponent(branch.address + ' ' + branch.city + ' ' + branch.state)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.directionsButton}
                    >
                      📍 Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
