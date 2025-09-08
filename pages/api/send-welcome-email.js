import { supabaseAdmin } from '../../lib/supabaseClient';
import { sendEmail } from '../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name, middle_name, last_name, account_numbers, account_types, application_id, country, enrollment_token } = req.body;

  if (!email || !first_name || !last_name || !application_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Use provided enrollment token or generate one
    const enrollmentToken = enrollment_token || `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Fetch accounts based on application_id
    const { data: accounts, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_type')
      .eq('application_id', application_id);

    if (accountError) {
      console.error('Error fetching accounts:', accountError);
      return res.status(500).json({ error: 'Failed to fetch account details' });
    }

    const populatedAccountNumbers = accounts ? accounts.map(acc => acc.account_number) : [];
    const populatedAccountTypes = accounts ? accounts.map(acc => acc.account_type) : [];

    // Check if enrollment record already exists for this email
    const { data: existingEnrollment, error: checkError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('email', email)
      .single();

    // Only create/update enrollment record if no token was provided (meaning it wasn't already created)
    if (!enrollment_token) {
      if (existingEnrollment) {
        // Update existing enrollment record with new token
        const { error: updateError } = await supabaseAdmin
          .from('enrollments')
          .update({ 
            token: enrollmentToken,
            is_used: false 
          })
          .eq('email', email);

        if (updateError) {
          console.error('Error updating enrollment token:', updateError);
          return res.status(500).json({ error: 'Failed to update enrollment record' });
        }
      } else {
        // Create new enrollment record
        const { error: insertError } = await supabaseAdmin
          .from('enrollments')
          .insert([{
            email: email,
            token: enrollmentToken,
            is_used: false,
            application_id: application_id
          }]);

        if (insertError) {
          console.error('Error storing enrollment token:', insertError);
          return res.status(500).json({ error: 'Failed to create enrollment record' });
        }
      }
    }

    // Generate enrollment link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : 'https://oaklineworkspac-oakline-bank.repl.co';
    const enrollLink = `${siteUrl}/enroll?token=${enrollmentToken}&application_id=${application_id}`;

    // Prepare full name
    const fullName = `${first_name} ${middle_name ? middle_name + ' ' : ''}${last_name}`;

    // Prepare account details HTML
    const accountDetailsHtml = populatedAccountNumbers.length > 0 ? `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Your Account Numbers:</h3>
        ${populatedAccountNumbers.map((num, index) => `
          <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
            <strong>${populatedAccountTypes[index] ? populatedAccountTypes[index].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Account'}:</strong> ${num}
          </p>
        `).join('')}
        <p style="font-family: monospace; font-size: 16px; margin: 5px 0;">
          <strong>Routing Number:</strong> 075915826
        </p>
      </div>
    ` : '';

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Oakline Bank Enrollment</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .button { display: inline-block; padding: 15px 30px; background: #1e40af; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Oakline Bank!</h1>
          </div>
          <div class="content">
            <h2>Complete Your Enrollment</h2>
            <p>Hello ${fullName},</p>
            <p>Your application has been processed and your accounts are ready for activation.</p>

            ${accountDetailsHtml}

            <p>To complete your enrollment and activate your accounts, please click the button below:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${enrollLink}" class="button">
                Complete Enrollment
              </a>
            </div>

            <p><strong>Important:</strong> During enrollment, you'll need to:</p>
            <ul>
              <li>Set your account password</li>
              <li>Provide your ${country === 'US' ? 'Social Security Number (SSN)' : 'Government ID Number'}</li>
              <li>Select one of your account numbers listed above</li>
              <li>Agree to our Terms of Service and Privacy Policy</li>
            </ul>

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

    // Construct account details HTML snippet
    let accountDetailsHtml = '';
    if (populatedAccountNumbers && populatedAccountNumbers.length > 0) {
      accountDetailsHtml = `
        <div class="accounts">
          <h3>📋 Your New Account Details:</h3>
          ${populatedAccountNumbers.map((num, index) => `
            <p><strong>${populatedAccountTypes && populatedAccountTypes[index] ? populatedAccountTypes[index].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Account'}:</strong> ${num}</p>
          `).join('')}
          <p><strong>Routing Number:</strong> 075915826</p>
        </div>
      `;
    }

    // Construct the email HTML
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
          .checkbox-container { 
            margin-top: 20px; 
            padding: 15px; 
            background-color: #ffffff; 
            border: 1px solid #e2e8f0; 
            border-radius: 6px;
            position: relative; /* Needed for z-index */
            z-index: 1; /* Ensure it's above background if needed */
          }
          .checkbox-container label {
            display: flex; /* Use flex to align checkbox and text */
            align-items: center; /* Vertically center items */
            cursor: pointer;
            color: #333;
          }
          .checkbox-container input[type="checkbox"] {
            margin-right: 10px; /* Space between checkbox and text */
            transform: scale(1.2); /* Make checkbox slightly larger */
          }
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

            ${accountDetailsHtml}

            <p><strong>Secure Your Account:</strong></p>
            <p>To access your online banking account, please complete your enrollment by clicking the button below:</p>

            <div style="text-align: center;">
              <a href="${enrollLink}" class="button">Complete Enrollment</a>
            </div>

            <p><em>This link will expire in 7 days for security purposes.</em></p>

            <p><strong>Important:</strong> During enrollment, you'll need to:</p>
            <ul>
              <li>Set your account password</li>
              <li>Provide your ${country === 'US' ? 'Social Security Number (SSN)' : 'Government ID Number'}</li>
              <li>Select one of your account numbers listed above</li>
              <li>Agree to our Terms of Service and Privacy Policy</li>
            </ul>

            <div class="checkbox-container">
              <label>
                <input type="checkbox" required>
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
              </label>
            </div>

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

    // Fix Supabase Auth user creation: Use application email and ensure user is created correctly
    // This part is handled by the frontend enrollment form logic that calls this API.
    // The API's responsibility here is to initiate the enrollment process.
    // The actual Supabase Auth user creation happens on the enrollment page after token verification.

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