
// pages/api/resend-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, application_id } = req.body;

  // Validate input - require either email or application_id
  if (!email && !application_id) {
    return res.status(400).json({ error: 'Either email or application_id is required' });
  }

  try {
    let application;

    // Find application by email or application_id
    if (application_id) {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('id', application_id)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'Application not found' });
      }
      application = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'Application not found' });
      }
      application = data;
    }

    // Check if user has already enrolled by checking if auth user exists
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('Error checking auth users:', authError);
    } else {
      const existingAuthUser = authUsers.users.find(user => user.email === application.email);
      if (existingAuthUser) {
        return res.status(400).json({ error: 'User has already completed enrollment' });
      }
    }

    // Get application's account numbers for the email
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type')
      .eq('application_id', application.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return res.status(500).json({ error: 'Failed to fetch account information' });
    }

    const accountNumbers = accounts?.map(acc => acc.account_number) || [];
    const accountTypes = accounts?.map(acc => acc.account_type) || [];

    // Generate enrollment token
    const enrollmentToken = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Check if enrollment record already exists for this email
    const { data: existingEnrollment, error: checkError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', application.email)
      .single();

    let enrollmentRecord;
    if (existingEnrollment) {
      // Update existing enrollment record with new token
      const { data: updatedEnrollment, error: updateError } = await supabaseAdmin
        .from('enrollments')
        .update({ 
          token: enrollmentToken,
          is_used: false 
        })
        .eq('email', application.email)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating enrollment token:', updateError);
        return res.status(500).json({ error: 'Failed to update enrollment record' });
      }
      enrollmentRecord = updatedEnrollment;
    } else {
      // Create new enrollment record
      const { data: newEnrollment, error: insertError } = await supabaseAdmin
        .from('enrollments')
        .insert([{
          email: application.email,
          token: enrollmentToken,
          is_used: false
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error storing enrollment token:', insertError);
        return res.status(500).json({ error: 'Failed to create enrollment record' });
      }
      enrollmentRecord = newEnrollment;
    }

    // Create enrollment link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://oaklineworkspac-oakline-bank.repl.co';
    
    const enrollLink = `${siteUrl}/enroll?token=${enrollmentToken}&application_id=${application.id}`;

    // Send enrollment email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Welcome to Oakline Bank, ${application.first_name}!</h2>
        <p>Your application has been processed and your accounts are ready for activation.</p>
        
        ${accountNumbers.length > 0 ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Account Numbers:</h3>
            ${accountNumbers.map((num, index) => `
              <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
                <strong>${accountTypes[index] ? accountTypes[index].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Account'}:</strong> ${num}
              </p>
            `).join('')}
            <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
              <strong>Routing Number:</strong> 075915826
            </p>
          </div>
        ` : ''}
        
        <p>To complete your enrollment and activate your accounts, please click the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${enrollLink}" 
             style="display: inline-block; padding: 15px 30px; background: #0070f3; color: white; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Complete Enrollment
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, you can copy and paste this link into your browser:<br>
          <a href="${enrollLink}">${enrollLink}</a>
        </p>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <p>Best regards,<br>
        <strong>Oakline Bank Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: application.email,
      subject: 'Complete Your Oakline Bank Enrollment',
      html: emailHtml
    });

    res.status(200).json({ 
      message: 'Enrollment email sent successfully',
      application: {
        id: application.id,
        email: application.email,
        name: `${application.first_name} ${application.last_name}`
      }
    });

  } catch (error) {
    console.error('Error resending enrollment:', error);
    res.status(500).json({ error: 'Failed to resend enrollment email' });
  }
}
