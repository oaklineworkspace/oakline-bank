import { supabaseAdmin } from '../../lib/supabaseClient';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name, last_name, account_numbers, account_types, application_id } = req.body;

  if (!email || !first_name || !last_name || !application_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate enrollment token
    const enrollmentToken = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Store enrollment token
    const { error: enrollmentError } = await supabaseAdmin
      .from('enrollments')
      .insert([{
        email: email,
        token: enrollmentToken,
        is_used: false
      }]);

    if (enrollmentError) {
      console.error('Error storing enrollment token:', enrollmentError);
      return res.status(500).json({ error: 'Failed to create enrollment record' });
    }

    // Get the account numbers for the email
    const accountNumbers = account_numbers || [];

    // Generate enrollment link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://oaklineworkspac-oakline-bank.repl.co';
    const enrollLink = `${siteUrl}/enroll?token=${enrollmentToken}&application_id=${application_id}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .accounts { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏦 Welcome to Oakline Bank!</h1>
          </div>
          <div class="content">
            <h2>Hello ${first_name} ${last_name},</h2>
            <p>Congratulations! Your account application has been received and processed successfully.</p>

            ${account_numbers && account_numbers.length > 0 ? `
            <div class="accounts">
              <h3>📋 Your New Account Details:</h3>
              ${account_numbers.map((num, index) => `
                <p><strong>${account_types && account_types[index] ? account_types[index].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Account'}:</strong> ${num}</p>
              `).join('')}
              <p><strong>Routing Number:</strong> 075915826</p>
            </div>
            ` : ''}

            <p><strong>🔐 Complete Your Enrollment:</strong></p>
            <p>To access your online banking account, please complete your enrollment by clicking the button below:</p>

            <div style="text-align: center;">
              <a href="${enrollmentLink}" class="button">Complete Enrollment</a>
            </div>

            <p><em>This link will expire in 7 days for security purposes.</em></p>

            <p>If you have any questions, please contact our customer support team.</p>

            <p>Thank you for choosing Oakline Bank!</p>
            <p><strong>The Oakline Bank Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2024 Oakline Bank. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: "Welcome to Oakline Bank - Complete Your Enrollment",
      html: emailHtml
    });

    res.status(200).json({ 
      message: 'Welcome email sent successfully',
      enrollment_token: enrollmentToken 
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
}