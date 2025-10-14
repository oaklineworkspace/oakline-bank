
-- Step 1: Add missing columns to profiles table (only if they don't exist)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS mothers_maiden_name text,
ADD COLUMN IF NOT EXISTS employment_status text,
ADD COLUMN IF NOT EXISTS annual_income text,
ADD COLUMN IF NOT EXISTS account_types text[];

-- Step 2: Update existing profiles with data from applications table using email match
UPDATE public.profiles p
SET 
  first_name = COALESCE(p.first_name, a.first_name),
  middle_name = COALESCE(p.middle_name, a.middle_name),
  last_name = COALESCE(p.last_name, a.last_name),
  phone = COALESCE(p.phone, a.phone),
  date_of_birth = COALESCE(p.date_of_birth, a.date_of_birth),
  country = COALESCE(p.country, a.country),
  address = COALESCE(p.address, a.address),
  city = COALESCE(p.city, a.city),
  state = COALESCE(p.state, a.state),
  zip_code = COALESCE(p.zip_code, a.zip_code),
  ssn = COALESCE(p.ssn, a.ssn),
  id_number = COALESCE(p.id_number, a.id_number),
  mothers_maiden_name = COALESCE(p.mothers_maiden_name, a.mothers_maiden_name),
  employment_status = COALESCE(p.employment_status, a.employment_status),
  annual_income = COALESCE(p.annual_income, a.annual_income),
  account_types = COALESCE(p.account_types, a.account_types),
  application_status = CASE 
    WHEN p.enrollment_completed = true THEN 'completed'
    WHEN a.application_status = 'approved' THEN 'approved'
    ELSE COALESCE(p.application_status, a.application_status, 'pending')
  END,
  updated_at = NOW()
FROM public.applications a
WHERE p.email = a.email;

-- Step 3: Create a trigger to automatically sync new applications to profiles using email
CREATE OR REPLACE FUNCTION sync_application_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile if it exists (match by email)
  UPDATE public.profiles
  SET
    first_name = NEW.first_name,
    middle_name = NEW.middle_name,
    last_name = NEW.last_name,
    phone = NEW.phone,
    date_of_birth = NEW.date_of_birth,
    country = NEW.country,
    address = NEW.address,
    city = NEW.city,
    state = NEW.state,
    zip_code = NEW.zip_code,
    ssn = NEW.ssn,
    id_number = NEW.id_number,
    mothers_maiden_name = NEW.mothers_maiden_name,
    employment_status = NEW.employment_status,
    annual_income = NEW.annual_income,
    account_types = NEW.account_types,
    application_status = NEW.application_status,
    updated_at = NOW()
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS sync_application_to_profile_trigger ON public.applications;
CREATE TRIGGER sync_application_to_profile_trigger
AFTER INSERT OR UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION sync_application_to_profile();

COMMENT ON TRIGGER sync_application_to_profile_trigger ON public.applications IS 'Automatically syncs application data to profiles table using email matching';
