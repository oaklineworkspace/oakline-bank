
-- Drop existing tables and policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert on applications" ON applications;
DROP POLICY IF EXISTS "Allow anonymous insert on accounts" ON accounts;
DROP POLICY IF EXISTS "Allow anonymous insert on enrollments" ON enrollments;

DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS applications CASCADE;

-- Create enum types for account types
CREATE TYPE account_type_enum AS ENUM (
    'checking_account',
    'savings_account', 
    'business_checking',
    'business_savings',
    'student_checking',
    'money_market',
    'certificate_of_deposit',
    'retirement_ira',
    'joint_checking',
    'trust_account',
    'investment_brokerage',
    'high_yield_savings',
    'international_checking',
    'foreign_currency',
    'cryptocurrency_wallet',
    'loan_repayment',
    'mortgage',
    'auto_loan',
    'credit_card',
    'prepaid_card',
    'payroll_account',
    'nonprofit_charity',
    'escrow_account'
);

-- Applications table - stores application information
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    mothers_maiden_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'US',
    ssn VARCHAR(20),
    id_number VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    employment_status VARCHAR(50) NOT NULL,
    annual_income VARCHAR(50) NOT NULL,
    account_types account_type_enum[] NOT NULL,
    agree_to_terms BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table - stores actual bank accounts linked to applications
CREATE TABLE accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID, -- Links to Supabase Auth user when enrollment is complete
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type account_type_enum NOT NULL,
    routing_number VARCHAR(20) DEFAULT '075915826',
    balance DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, limited, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table - manages enrollment tokens and process
CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (needed for form submission)
CREATE POLICY "Allow anonymous insert on applications" ON applications
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on accounts" ON accounts
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on enrollments" ON enrollments
    FOR INSERT TO anon WITH CHECK (true);

-- Allow service role to perform all operations
CREATE POLICY "Allow service role all operations on applications" ON applications
    FOR ALL TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role all operations on accounts" ON accounts
    FOR ALL TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role all operations on enrollments" ON enrollments
    FOR ALL TO service_role WITH CHECK (true);

-- Allow authenticated users to access their own data
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid()::text = id::text OR email = auth.email());

CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (email = auth.email());

-- Create indexes for better performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_id ON applications(id);
CREATE INDEX idx_accounts_application_id ON accounts(application_id);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_enrollments_email ON enrollments(email);
CREATE INDEX idx_enrollments_token ON enrollments(token);
CREATE INDEX idx_enrollments_application_id ON enrollments(application_id);
