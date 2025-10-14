
-- Card Applications Table
CREATE TABLE IF NOT EXISTS card_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id UUID NOT NULL,
  card_type VARCHAR(50) DEFAULT 'debit',
  cardholder_name VARCHAR(255) NOT NULL,
  card_number VARCHAR(16), -- Generated upon approval
  cvv VARCHAR(3), -- Generated upon approval
  expiry_date VARCHAR(5), -- Generated upon approval (MM/YY)
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards Table (for active cards)
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    application_id UUID REFERENCES card_applications(id) ON DELETE SET NULL,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    expiry_date VARCHAR(5) NOT NULL, -- MM/YY format
    cvv VARCHAR(4) NOT NULL,
    card_type VARCHAR(20) DEFAULT 'visa', -- visa, mastercard, amex
    status VARCHAR(20) DEFAULT 'active',
    daily_limit DECIMAL(10,2) DEFAULT 2000.00,
    monthly_limit DECIMAL(10,2) DEFAULT 10000.00,
    is_locked BOOLEAN DEFAULT FALSE,
    pin_hash VARCHAR(255),
    pin_set BOOLEAN DEFAULT FALSE,
    contactless_enabled BOOLEAN DEFAULT TRUE,
    international_enabled BOOLEAN DEFAULT FALSE,
    online_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='card_type') THEN
        ALTER TABLE cards ADD COLUMN card_type VARCHAR(20) DEFAULT 'visa';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='pin_hash') THEN
        ALTER TABLE cards ADD COLUMN pin_hash VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='pin_set') THEN
        ALTER TABLE cards ADD COLUMN pin_set BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='contactless_enabled') THEN
        ALTER TABLE cards ADD COLUMN contactless_enabled BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='international_enabled') THEN
        ALTER TABLE cards ADD COLUMN international_enabled BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='cards' AND column_name='online_enabled') THEN
        ALTER TABLE cards ADD COLUMN online_enabled BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Audit logs table for PIN actions
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    card_id INTEGER,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_card_applications_user_id ON card_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_card_applications_account_id ON card_applications(account_id);
CREATE INDEX IF NOT EXISTS idx_card_applications_status ON card_applications(status);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON cards(account_id);
CREATE INDEX IF NOT EXISTS idx_cards_card_number ON cards(card_number);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_card_id ON audit_logs(card_id);

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_card_applications_updated_at ON card_applications;
CREATE TRIGGER update_card_applications_updated_at 
    BEFORE UPDATE ON card_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
