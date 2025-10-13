
-- Add enrollment_completed_at column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS enrollment_completed_at timestamp with time zone;

-- Add updated_at column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update existing records where enrollment is completed but timestamp is missing
UPDATE public.profiles 
SET enrollment_completed_at = created_at 
WHERE enrollment_completed = true AND enrollment_completed_at IS NULL;
