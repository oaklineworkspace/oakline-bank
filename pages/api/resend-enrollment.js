// pages/api/resend-enrollment.js
import { supabaseAdmin } from '../../lib/supabaseClient';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, user_id } = req.body;

  // Validate input - require either email or user_id
  if (!email && !user_id) {
    return res.status(400).json({ error: 'Either email or user_id is required' });
  }

  try {
    let user;

    // Find user by email or user_id
    if (user_id) {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user_id)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'User not found' });
      }
      user = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'User not found' });
      }
      user = data;
    }

    // Check if user has already enrolled
    if (user.auth_id) {
      return res.status(400).json({ error: 'User has already completed enrollment' });
    }

    // Get user's account numbers for the email
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type')
      .eq('user_id', user.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return res.status(500).json({ error: 'Failed to fetch account information' });
    }

    const accountNumbers = accounts?.map(acc => acc.account_number) || [];

    // Create enrollment link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://oaklineworkspac-oakline-bank.repl.co';
    
    const enrollLink = `${siteUrl}/enroll?temp_user_id=${user.id}`;

    // Send enrollment email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0070f3;">Welcome to Oakline Bank, ${user.first_name}!</h2>
        <p>Your application has been processed and your accounts are ready for activation.</p>
        
        ${accountNumbers.length > 0 ? `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Your Account Numbers:</h3>
            <p style="font-family: monospace; font-size: 16px; margin: 0;">${accountNumbers.join(', ')}</p>
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
      to: user.email,
      subject: 'Complete Your Oakline Bank Enrollment',
      html: emailHtml
    });

    res.status(200).json({ 
      message: 'Enrollment email sent successfully',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      }
    });

  } catch (error) {
    console.error('Error resending enrollment:', error);
    res.status(500).json({ error: 'Failed to resend enrollment email' });
  }
}