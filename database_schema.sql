
-- Drop existing tables and types to reset
DROP TABLE IF EXISTS public.accounts CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS account_type_enum CASCADE;
DROP TYPE IF EXISTS employment_status_enum CASCADE;
DROP TYPE IF EXISTS annual_income_enum CASCADE;

-- Create enums
CREATE TYPE employment_status_enum AS ENUM (
  'employed_fulltime',
  'employed_parttime', 
  'self_employed',
  'retired',
  'student',
  'unemployed'
);

CREATE TYPE annual_income_enum AS ENUM (
  'under_25k',
  '25k_50k',
  '50k_75k', 
  '75k_100k',
  '100k_150k',
  'over_150k'
);

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

-- Create applications table
CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  date_of_birth date,
  country text,
  ssn text,
  id_number text,
  address text,
  city text,
  state text,
  zip_code text,
  employment_status employment_status_enum,
  annual_income annual_income_enum,
  account_types account_type_enum[],
  agree_to_terms boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT applications_pkey PRIMARY KEY (id)
);

-- Create accounts table with status column
CREATE TABLE public.accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  application_id uuid,
  account_number text NOT NULL UNIQUE,
  routing_number text NOT NULL DEFAULT '075915826'::text,
  account_type account_type_enum NOT NULL,
  balance numeric DEFAULT 0,
  status text DEFAULT 'active',
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE
);

-- Create enrollments table with application_id
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  token text NOT NULL,
  is_used boolean DEFAULT false,
  application_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE
);

-- Create profiles table with all required fields
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  application_id uuid,
  email text,
  first_name text,
  middle_name text,
  last_name text,
  phone text,
  date_of_birth date,
  country text,
  address text,
  city text,
  state text,
  zip_code text,
  ssn text,
  id_number text,
  enrollment_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT profiles_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for applications
CREATE POLICY "Allow insert for applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for applications" ON public.applications FOR SELECT USING (true);

-- Create policies for accounts
CREATE POLICY "Allow insert for accounts" ON public.accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for accounts" ON public.accounts FOR SELECT USING (true);
CREATE POLICY "Allow update for accounts" ON public.accounts FOR UPDATE USING (true);

-- Create policies for enrollments
CREATE POLICY "Allow insert for enrollments" ON public.enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Allow update for enrollments" ON public.enrollments FOR UPDATE USING (true);

-- Create policies for profiles
CREATE POLICY "Allow insert for profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow update for profiles" ON public.profiles FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_applications_email ON public.applications(email);
CREATE INDEX idx_accounts_application_id ON public.accounts(application_id);
CREATE INDEX idx_accounts_account_number ON public.accounts(account_number);
CREATE INDEX idx_enrollments_email ON public.enrollments(email);
CREATE INDEX idx_enrollments_token ON public.enrollments(token);
CREATE INDEX idx_enrollments_application_id ON public.enrollments(application_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
