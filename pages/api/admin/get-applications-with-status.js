import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all applications with their user status
    const { data: applicationsData, error: appsError } = await supabaseAdmin
      .from('applications')
      .select(`
        id,
        email,
        first_name,
        middle_name,
        last_name,
        created_at,
        country
      `)
      .order('created_at', { ascending: false });

    if (appsError) throw appsError;

    // Get users table to check auth status
    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('users')
      .select('application_id, email, created_at, is_active');

    if (usersError) {
      console.warn('Users table query failed:', usersError);
    }

    // Get enrollment records
    const { data: enrollmentsData, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select('application_id, email, is_used, created_at');

    if (enrollError) {
      console.warn('Enrollments table query failed:', enrollError);
    }

    // Check Supabase Auth users
    const { data: authUsersData } = await supabaseAdmin.auth.admin.listUsers();
    
    // Combine data
    const enrichedApplications = applicationsData.map(app => {
      const userRecord = usersData?.find(u => u.application_id === app.id);
      const enrollmentRecord = enrollmentsData?.find(e => e.application_id === app.id || e.email === app.email);
      const authUser = authUsersData?.users?.find(u => u.email === app.email);
      
      let status = 'pending';
      if (authUser && userRecord?.is_active) {
        status = 'completed';
      } else if (authUser) {
        status = 'auth_created';
      } else if (enrollmentRecord) {
        status = 'enrollment_sent';
      }

      return {
        ...app,
        status,
        user_record: userRecord,
        enrollment_record: enrollmentRecord,
        auth_user: authUser
      };
    });

    return res.status(200).json({
      applications: enrichedApplications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch applications',
      details: error.message 
    });
  }
}
