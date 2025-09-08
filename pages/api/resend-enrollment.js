import { supabaseAdmin } from '../../lib/supabaseClient';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { applicationId } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: 'Application ID is required' });
  }

  try {
    // Get application data
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Get associated accounts
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type')
      .eq('application_id', applicationId);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return res.status(500).json({ error: 'Failed to fetch account details' });
    }

    const accountNumbers = accounts ? accounts.map(acc => acc.account_number) : [];
    const accountTypes = accounts ? accounts.map(acc => acc.account_type) : [];

    // Generate new enrollment token
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
          is_used: false,
          application_id: applicationId
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

    // Prepare account details HTML
    const accountDetailsHtml = accountNumbers.length > 0 ? `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Your Account Numbers:</h3>
        ${accountNumbers.map((num, index) => `
          <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
            <strong>${accountTypes[index] ? accountTypes[index].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Account'}:</strong> ${num}
          </p>
        `).join('')}
        <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
          <strong>Routing Number:</strong> 075915826
        </p>
      </div>
    ` : '';

    // Send enrollment email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Complete Your Oakline Bank Enrollment</h2>
        <p>Hello ${application.first_name} ${application.middle_name ? application.middle_name + ' ' : ''}${application.last_name},</p>
        <p>Your application has been processed and your accounts are ready for activation.</p>

        ${accountDetailsHtml}

        <p>To complete your enrollment and activate your accounts, please click the button below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${enrollLink}" 
             style="display: inline-block; padding: 15px 30px; background: #0070f3; color: white; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Complete Enrollment
          </a>
        </div>

        <p><strong>Important:</strong> During enrollment, you'll need to:</p>
        <ul>
          <li>Set your account password</li>
          <li>Provide your ${application.country === 'US' ? 'Social Security Number (SSN)' : 'Government ID Number'}</li>
          <li>Select one of your account numbers listed above</li>
          <li>Agree to our Terms of Service and Privacy Policy</li>
        </ul>

        <p><em>This link will expire in 7 days for security purposes.</em></p>

        <p>If you have any questions, please contact our customer support team.</p>
        <p>Thank you for choosing Oakline Bank!</p>
        <p><strong>The Oakline Bank Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: application.email,
      subject: "Complete Your Oakline Bank Enrollment",
      html: emailHtml
    });

    res.status(200).json({ 
      message: 'Enrollment email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending enrollment email:', error);
    res.status(500).json({ error: 'Failed to send enrollment email' });
  }
}