
-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  card_number VARCHAR(19) NOT NULL UNIQUE,
  cardholder_name VARCHAR(100) NOT NULL,
  expiry_date VARCHAR(5) NOT NULL,
  cvv VARCHAR(4) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'expired', 'cancelled')),
  daily_limit DECIMAL(12,2) DEFAULT 1000.00,
  monthly_limit DECIMAL(12,2) DEFAULT 10000.00,
  is_locked BOOLEAN DEFAULT false,
  contactless_enabled BOOLEAN DEFAULT true,
  international_enabled BOOLEAN DEFAULT false,
  online_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create card applications table
CREATE TABLE IF NOT EXISTS card_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  cardholder_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  card_number VARCHAR(19),
  expiry_date VARCHAR(5),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_card_applications_user_id ON card_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_card_applications_status ON card_applications(status);

-- Enable RLS (Row Level Security)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cards
CREATE POLICY "Users can view their own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for card applications
CREATE POLICY "Users can view their own card applications" ON card_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own card applications" ON card_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own card applications" ON card_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to generate card number
CREATE OR REPLACE FUNCTION generate_card_number()
RETURNS VARCHAR(19) AS $$
DECLARE
  card_number VARCHAR(19);
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate a 16-digit card number starting with 4000 (Visa format)
    card_number := '4000 ' || 
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || ' ' ||
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || ' ' ||
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if this card number already exists
    SELECT COUNT(*) INTO exists_check FROM cards WHERE card_number = card_number;
    
    -- If it doesn't exist, break the loop
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN card_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate expiry date (2 years from now)
CREATE OR REPLACE FUNCTION generate_expiry_date()
RETURNS VARCHAR(5) AS $$
BEGIN
  RETURN TO_CHAR(NOW() + INTERVAL '2 years', 'MM/YY');
END;
$$ LANGUAGE plpgsql;

-- Function to generate CVV
CREATE OR REPLACE FUNCTION generate_cvv()
RETURNS VARCHAR(4) AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_card_applications_updated_at
  BEFORE UPDATE ON card_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
