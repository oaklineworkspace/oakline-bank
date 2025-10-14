
-- Function to auto-create debit card when account is approved
CREATE OR REPLACE FUNCTION auto_create_debit_card()
RETURNS TRIGGER AS $$
DECLARE
  v_card_number TEXT;
  v_expiry_date DATE;
  v_cvc TEXT;
BEGIN
  -- Only create card if status changed to 'active' and no card exists yet
  IF NEW.status = 'active' AND (OLD.status IS NULL OR OLD.status != 'active') THEN
    
    -- Check if card already exists for this account
    IF NOT EXISTS (
      SELECT 1 FROM cards 
      WHERE account_id = NEW.id AND status = 'active'
    ) THEN
      
      -- Generate card number (16 digits starting with 4)
      v_card_number := '4' || LPAD(FLOOR(RANDOM() * 999999999999999)::TEXT, 15, '0');
      
      -- Set expiry date to 3 years from now
      v_expiry_date := CURRENT_DATE + INTERVAL '3 years';
      
      -- Generate 3-digit CVC
      v_cvc := LPAD(FLOOR(RANDOM() * 999)::TEXT, 3, '0');
      
      -- Insert new card
      INSERT INTO cards (
        user_id,
        account_id,
        card_number,
        card_type,
        status,
        expiry_date,
        daily_limit,
        monthly_limit,
        daily_spent,
        monthly_spent,
        cvc,
        is_locked
      ) VALUES (
        NEW.user_id,
        NEW.id,
        v_card_number,
        'debit',
        'active',
        v_expiry_date,
        5000,
        20000,
        0,
        0,
        v_cvc,
        false
      );
      
      RAISE NOTICE 'Auto-created debit card for account %', NEW.account_number;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_create_debit_card ON accounts;
CREATE TRIGGER trigger_auto_create_debit_card
  AFTER INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_debit_card();

COMMENT ON FUNCTION auto_create_debit_card IS 'Automatically creates a debit card when an account status becomes active';
