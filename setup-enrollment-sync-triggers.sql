
-- ====================================
-- ENROLLMENT SYNC TRIGGERS
-- ====================================
-- These triggers ensure that enrollment status, profile completion,
-- and application status stay in sync across all tables.

-- 1. Trigger to sync profile when enrollment is completed
CREATE OR REPLACE FUNCTION sync_profile_on_enrollment_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- When enrollment is marked as used (completed)
  IF NEW.is_used = TRUE AND (OLD.is_used IS NULL OR OLD.is_used = FALSE) THEN
    -- Update the profile to mark enrollment as completed
    UPDATE profiles
    SET 
      enrollment_completed = TRUE,
      enrollment_completed_at = NEW.completed_at,
      password_set = TRUE,
      application_status = 'completed',
      updated_at = NOW()
    WHERE email = NEW.email;

    -- Update the application status to completed
    UPDATE applications
    SET 
      application_status = 'completed',
      processed_at = NEW.completed_at
    WHERE id = NEW.application_id;

    RAISE NOTICE 'Synced profile and application for enrollment completion: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_sync_profile_on_enrollment_complete ON enrollments;
CREATE TRIGGER trigger_sync_profile_on_enrollment_complete
  AFTER UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_on_enrollment_complete();

-- 2. Trigger to sync application when profile enrollment is completed
CREATE OR REPLACE FUNCTION sync_application_on_profile_complete()
RETURNS TRIGGER AS $$
BEGIN
  -- When profile enrollment is marked as completed
  IF NEW.enrollment_completed = TRUE AND (OLD.enrollment_completed IS NULL OR OLD.enrollment_completed = FALSE) THEN
    -- Update the enrollment to mark as used
    UPDATE enrollments
    SET 
      is_used = TRUE,
      completed_at = NEW.enrollment_completed_at
    WHERE email = NEW.email AND is_used = FALSE;

    -- Update the application status to completed
    UPDATE applications
    SET 
      application_status = 'completed',
      processed_at = NEW.enrollment_completed_at
    WHERE id = NEW.application_id;

    RAISE NOTICE 'Synced enrollment and application for profile completion: %', NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_sync_application_on_profile_complete ON profiles;
CREATE TRIGGER trigger_sync_application_on_profile_complete
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_application_on_profile_complete();

-- 3. Trigger to sync account status with application status
CREATE OR REPLACE FUNCTION sync_account_status_with_application()
RETURNS TRIGGER AS $$
BEGIN
  -- When application is approved, activate all related accounts
  IF NEW.application_status = 'approved' AND (OLD.application_status IS NULL OR OLD.application_status != 'approved') THEN
    UPDATE accounts
    SET 
      status = 'active',
      updated_at = NOW()
    WHERE application_id = NEW.id AND status = 'pending';

    RAISE NOTICE 'Activated accounts for approved application: %', NEW.id;
  END IF;

  -- When application is rejected, reject all related accounts
  IF NEW.application_status = 'rejected' AND (OLD.application_status IS NULL OR OLD.application_status != 'rejected') THEN
    UPDATE accounts
    SET 
      status = 'rejected',
      updated_at = NOW()
    WHERE application_id = NEW.id AND status = 'pending';

    RAISE NOTICE 'Rejected accounts for rejected application: %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_sync_account_status_with_application ON applications;
CREATE TRIGGER trigger_sync_account_status_with_application
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION sync_account_status_with_application();

-- 4. Add comments for documentation
COMMENT ON FUNCTION sync_profile_on_enrollment_complete IS 'Syncs profile and application status when enrollment is completed';
COMMENT ON FUNCTION sync_application_on_profile_complete IS 'Syncs enrollment and application status when profile enrollment is completed';
COMMENT ON FUNCTION sync_account_status_with_application IS 'Syncs account status when application status changes';

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ All enrollment sync triggers created successfully!';
  RAISE NOTICE '1. Enrollment completion syncs profile and application';
  RAISE NOTICE '2. Profile completion syncs enrollment and application';
  RAISE NOTICE '3. Application approval/rejection syncs account statuses';
END $$;
