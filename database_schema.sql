
-- Drop existing tables and policies if they exist
DROP POLICY IF EXISTS "Allow public insert on users" ON users;
DROP POLICY IF EXISTS "Allow public insert on user_employment" ON user_employment;
DROP POLICY IF EXISTS "Allow public insert on user_account_types" ON user_account_types;
DROP POLICY IF EXISTS "Allow public insert on accounts" ON accounts;
DROP POLICY IF EXISTS "Allow public insert on applications" ON applications;

DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS user_account_types CASCADE;
DROP TABLE IF EXISTS user_employment CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table - stores main user information
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    mothers_maiden_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    ssn VARCHAR(20),
    id_number VARCHAR(50),
    address_line1 TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    county VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User employment table
CREATE TABLE user_employment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employment_status VARCHAR(50) NOT NULL,
    annual_income VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User selected account types
CREATE TABLE user_account_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_type_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table - stores actual bank accounts
CREATE TABLE accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(100) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'limited',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table - tracks application status
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (needed for form submission)
CREATE POLICY "Allow anonymous insert on users" ON users
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on user_employment" ON user_employment
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on user_account_types" ON user_account_types
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on accounts" ON accounts
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on applications" ON applications
    FOR INSERT TO anon WITH CHECK (true);

-- Also allow authenticated users to access their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own employment" ON user_employment
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own account types" ON user_account_types
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_user_employment_user_id ON user_employment(user_id);
CREATE INDEX idx_user_account_types_user_id ON user_account_types(user_id);
