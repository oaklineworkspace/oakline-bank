import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    citizenship: 'US',
    first_name: '',
    middle_name: '',
    last_name: '',
    mothers_maiden_name: '',
    email: '',
    phone: '',
    ssn: '',
    id_number: '',
    dob: '',
    account_types: [],
    country: 'United States',
    state: '',
    city: '',
    address_line1: '',
    address_line2: ''
  });

  const [customCountry, setCustomCountry] = useState('');
  const [customState, setCustomState] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const countries = [
    'United States','United Kingdom','Canada','Germany','France','Australia',
    'Nigeria','Japan','Brazil','India','Mexico','South Africa','Italy','Spain',
    'China','Russia','Netherlands','Sweden','Norway','Other'
  ];

  const countryStates = {
    'United States': ['California','New York','Texas','Florida','Other'],
    'Canada': ['Ontario','Quebec','British Columbia','Alberta','Other'],
    'Australia': ['New South Wales','Victoria','Queensland','Other'],
    'Nigeria': ['Lagos','Abuja','Kano','Other'],
    'Other': ['Other']
  };

  const accountTypes = [
    'Checking','Savings','Business Checking','Student','Joint','Premium','IRA','Money Market',
    'Certificate of Deposit','Foreign Currency','Trust','Healthcare Savings','Youth Savings',
    'Senior Savings','Payroll','Loan','Crypto','Retirement Savings','Education Savings',
    'Investment','Estate','Emergency Fund','Special Purpose'
  ];

  const handleChange = (e) => setFormData({...formData,[e.target.name]: e.target.value});

  const handleAccountTypeChange = (type) => {
    const selected = formData.account_types;
    if (selected.includes(type)) {
      setFormData({...formData, account_types: selected.filter(t=>t!==type)});
    } else {
      setFormData({...formData, account_types: [...selected,type]});
    }
  };

  const nextStep = () => setStep(step+1);
  const prevStep = () => setStep(step-1);

  const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (formData.account_types.length === 0) {
        setMessage('Select at least one account type.');
        setLoading(false);
        return;
      }

      // Country/State/City
      const countryValue = customCountry || formData.country;
      const stateValue = customState || formData.state;
      const cityValue = customCity || formData.city;

      const userInsert = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        mothers_maiden_name: formData.mothers_maiden_name,
        email: formData.email,
        phone: formData.phone,
        ssn: formData.citizenship==='US' ? formData.ssn.replace(/-/g,'') : null,
        id_number: formData.citizenship==='US' ? null : formData.id_number,
        dob: formData.dob,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: cityValue,
        state: stateValue,
        country: countryValue
      };

      const { data: userData, error: userError } = await supabase.from('users').insert([userInsert]).select().single();
      if (userError) throw userError;

      const accountsToCreate = formData.account_types.map(type => ({
        user_id: userData.id,
        account_number: generateAccountNumber(),
        account_type: type,
        balance: 0.00,
        status: 'limited'
      }));

      const { data: accountsData, error: accountsError } = await supabase.from('accounts').insert(accountsToCreate).select();
      if (accountsError) throw accountsError;

      // Send welcome email with enrollment link
      const emailResponse = await fetch('/api/send-enrollment-email', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          temp_user_id: userData.id
        })
      });

      if (!emailResponse.ok) console.warn('Email failed.');

      setMessage(`Application submitted! ${accountsData.length} account(s) created. Check your email to enroll.`);

    } catch(error) {
      console.error(error);
      setMessage('Error: Something went wrong. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width:'100%', padding:'12px', border:'2px solid #e1e5e9', borderRadius:'8px', marginBottom:'15px' };
  const buttonStyle = { padding:'12px 24px', margin:'5px', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'16px' };
  const accountTypeStyle = (type) => ({
    display:'inline-block', margin:'5px', padding:'10px 15px', borderRadius:'8px', cursor:'pointer',
    border: formData.account_types.includes(type) ? '2px solid #28a745' : '2px solid #ccc',
    backgroundColor: formData.account_types.includes(type) ? '#d4edda' : '#f8f9fa',
    color:'#000'
  });

  return (
    <div style={{maxWidth:'600px',margin:'2rem auto',padding:'2rem',fontFamily:'Arial,sans-serif',backgroundColor:'#f8f9fa',borderRadius:'12px'}}>
      <h1 style={{textAlign:'center',color:'#0070f3',marginBottom:'2rem'}}>Apply for Banking Account</h1>
      <form onSubmit={handleSubmit}>
        {step===1 && (
          <div>
            <h3>Step 1: Personal Info</h3>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} required/>
            <select name="citizenship" value={formData.citizenship} onChange={handleChange} style={inputStyle}>
              <option value="US">United States</option>
              <option value="International">International</option>
            </select>
            <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} style={inputStyle} required/>
            <input name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleChange} style={inputStyle}/>
            <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} style={inputStyle} required/>
            <input name="mothers_maiden_name" placeholder="Mother's Maiden Name" value={formData.mothers_maiden_name} onChange={handleChange} style={inputStyle}/>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} required/>
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} style={inputStyle} required/>
            {formData.citizenship==='US' ? (
              <input name="ssn" placeholder="SSN" value={formData.ssn} onChange={handleChange} style={inputStyle} required/>
            ):(
              <input name="id_number" placeholder="ID Number" value={formData.id_number} onChange={handleChange} style={inputStyle} required/>
            )}
            <button type="button" onClick={nextStep} style={{...buttonStyle, backgroundColor:'#0070f3', color:'#fff'}}>Next →</button>
          </div>
        )}

        {step===2 && (
          <div>
            <h3>Step 2: Account Types</h3>
            <div style={{display:'flex',flexWrap:'wrap'}}>
              {accountTypes.map(type => (
                <div key={type} style={accountTypeStyle(type)} onClick={()=>handleAccountTypeChange(type)}>{type}</div>
              ))}
            </div>
            <div style={{marginTop:'15px'}}>
              <button type="button" onClick={prevStep} style={{...buttonStyle, backgroundColor:'#6c757d', color:'#fff'}}>← Back</button>
              <button type="button" onClick={nextStep} style={{...buttonStyle, backgroundColor:'#0070f3', color:'#fff'}}>Next →</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div>
            <h3>Step 3: Address</h3>
            <input name="address_line1" placeholder="Address Line 1" value={formData.address_line1} onChange={handleChange} style={inputStyle} required/>
            <input name="address_line2" placeholder="Address Line 2" value={formData.address_line2} onChange={handleChange} style={inputStyle}/>
            <input name="city" placeholder="City" value={customCity || formData.city} onChange={(e)=>setCustomCity(e.target.value)} style={inputStyle} required/>
            <select value={formData.country} onChange={(e)=>setFormData({...formData,country:e.target.value})} style={inputStyle}>
              {countries.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            {formData.country==='Other' && <input placeholder="Enter country" value={customCountry} onChange={(e)=>setCustomCountry(e.target.value)} style={inputStyle} required/>}
            <select value={formData.state} onChange={(e)=>setFormData({...formData,state:e.target.value})} style={inputStyle}>
              {(countryStates[formData.country] || ['Other']).map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {formData.state==='Other' && <input placeholder="Enter state" value={customState} onChange={(e)=>setCustomState(e.target.value)} style={inputStyle} required/>}
            <div style={{marginTop:'15px'}}>
              <button type="button" onClick={prevStep} style={{...buttonStyle, backgroundColor:'#6c757d', color:'#fff'}}>← Back</button>
              <button type="submit" style={{...buttonStyle, backgroundColor:'#28a745', color:'#fff'}}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </div>
          </div>
        )}
      </form>
      {message && <div style={{marginTop:'20px',padding:'1rem',backgroundColor:'#d4edda',borderRadius:'8px',color:'#155724'}}>{message}</div>}
    </div>
  );
}