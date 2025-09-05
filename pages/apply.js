
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Apply() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    ssn: '',
    idNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    accountTypes: [],
    employment: '',
    income: '',
    termsAgreed: false
  });

  const accountTypes = [
    { id: 1, title: 'Checking', icon: '💳', description: 'Everyday banking' },
    { id: 2, title: 'Savings', icon: '💰', description: 'Earn interest' },
    { id: 3, title: 'Premium', icon: '⭐', description: 'Priority service' },
    { id: 4, title: 'Business', icon: '🏢', description: 'Business solutions' },
    { id: 5, title: 'Student', icon: '🎓', description: 'Low fees for students' },
    { id: 6, title: 'Joint', icon: '🤝', description: 'Shared account' },
    { id: 7, title: 'Retirement', icon: '🏖️', description: 'Plan your future' },
    { id: 8, title: 'Investment', icon: '📈', description: 'Grow your wealth' },
    { id: 9, title: 'Crypto', icon: '🪙', description: 'Digital currency account' },
  ];

  const countries = ['US', 'Canada', 'UK', 'Australia', 'Other'];

  // Fetch states dynamically
  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase.from('states').select('code, name').order('name');
      if (error) console.error(error);
      else setStates(data);
    };
    fetchStates();
  }, []);

  // Fetch cities dynamically based on state
  useEffect(() => {
    if (!formData.state) return;

    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('name')
        .eq('state_code', formData.state)
        .order('name');

      if (error) console.error(error);
      else setCities(data.map(c => c.name));
    };

    fetchCities();
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleAccountType = (id) => {
    setFormData(prev => {
      const selected = prev.accountTypes.includes(id)
        ? prev.accountTypes.filter(a => a !== id)
        : [...prev.accountTypes, id];
      return { ...prev, accountTypes: selected };
    });
  };

  const handleNext = () => currentStep < 3 && setCurrentStep(prev => prev + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.termsAgreed) return alert('You must agree to terms');
    setIsSubmitting(true);

    try {
      // Insert user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          ssn: formData.country === 'US' ? formData.ssn : null,
          id_number: formData.country !== 'US' ? formData.idNumber : null,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country
        }])
        .select()
        .single();

      if (userError) throw userError;

      const userId = user.id;

      // Insert employment
      await supabase.from('user_employment').insert([{
        user_id: userId,
        employment_status: formData.employment,
        annual_income: formData.income
      }]);

      // Insert selected account types
      const accountInsert = formData.accountTypes.map(id => ({
        user_id: userId,
        account_type_id: id
      }));
      await supabase.from('user_account_types').insert(accountInsert);

      router.push(`/success?message=Application submitted successfully!`);
    } catch (error) {
      console.error(error);
      alert('Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">🏦 Oakline Bank Application</h1>
        <Link href="/login" className="text-blue-700 underline">Sign In</Link>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
        {/* Step Indicators */}
        <div className="flex justify-center gap-4 mb-6">
          {[1,2,3].map(step => (
            <div key={step} className={`w-10 h-10 rounded-full flex items-center justify-center
              ${step === currentStep ? 'bg-blue-700 text-white' : step < currentStep ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              {step}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="First Name*" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input"/>
              <input placeholder="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} className="input"/>
              <input placeholder="Last Name*" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input"/>
              <input placeholder="Email*" name="email" type="email" value={formData.email} onChange={handleInputChange} className="input"/>
              <input placeholder="Phone*" name="phone" value={formData.phone} onChange={handleInputChange} className="input"/>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="input"/>
            </div>

            {formData.country === 'US' 
              ? <input placeholder="SSN" name="ssn" value={formData.ssn} onChange={handleInputChange} className="input"/>
              : <input placeholder="ID Number" name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="input"/>
            }

            <input placeholder="Address*" name="address" value={formData.address} onChange={handleInputChange} className="input"/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="City*" name="city" list="city-list" value={formData.city} onChange={handleInputChange} className="input"/>
              <datalist id="city-list">
                {cities.map(city => <option key={city} value={city} />)}
              </datalist>

              <select name="state" value={formData.state} onChange={handleInputChange} className="input">
                <option value="">Select State</option>
                {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>

              <input placeholder="ZIP Code*" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="input"/>
            </div>

            <select name="country" value={formData.country} onChange={handleInputChange} className="input">
              <option value="">Select Country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Step 2: Account Types & Employment */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Select Account Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {accountTypes.map(a => {
                const selected = formData.accountTypes.includes(a.id);
                return (
                  <div key={a.id} onClick={() => toggleAccountType(a.id)}
                    className={`p-4 rounded-lg cursor-pointer border-2 ${selected ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'}`}>
                    <div className="text-2xl">{a.icon}</div>
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-gray-600">{a.description}</div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select name="employment" value={formData.employment} onChange={handleInputChange} className="input">
                <option value="">Select Employment Status</option>
                <option value="employed">Employed Full-time</option>
                <option value="parttime">Employed Part-time</option>
                <option value="selfemployed">Self-employed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
              </select>

              <select name="income" value={formData.income} onChange={handleInputChange} className="input">
                <option value="">Select Annual Income</option>
                <option value="under25k">Under $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-75k">$50,000 - $75,000</option>
                <option value="75k-100k">$75,000 - $100,000</option>
                <option value="over100k">Over $100,000</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Review & Submit</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Selected Accounts:</strong> {formData.accountTypes.map(id => accountTypes.find(a => a.id===id)?.title).join(', ')}</p>
              <p><strong>Employment:</strong> {formData.employment}</p>
              <p><strong>Income:</strong> {formData.income}</p>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="termsAgreed" checked={formData.termsAgreed} onChange={handleInputChange}/>
              I agree to the <Link href="/terms" className="text-blue-700 underline">Terms</Link> and <Link href="/privacy" className="text-blue-700 underline">Privacy Policy</Link>
            </label>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && <button onClick={handleBack} className="btn-secondary">Back</button>}
          {currentStep < 3 && <button onClick={handleNext} className="btn-primary">Next</button>}
          {currentStep === 3 && (
            <button onClick={handleSubmit} disabled={!formData.termsAgreed || isSubmitting} className="btn-primary">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}