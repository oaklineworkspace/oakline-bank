// pages/api/send-welcome-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, first_name, last_name, account_numbers, account_types, temp_user_id } = req.body;

  if (!email || !first_name || (!account_numbers && !req.body.account_number) || !temp_user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Handle both old single account and new multiple accounts format
  const accountsList = account_numbers || [req.body.account_number];
  const typesList = account_types || ['Checking'];

  try {
    console.log('Attempting to send welcome email to:', email);
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test the connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      throw new Error(`SMTP configuration error: ${verifyError.message}`);
    }

    // Get the base URL for enrollment link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000');
    
    const enrollmentLink = `${baseUrl}/enroll?temp_user_id=${temp_user_id}`;

    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0070f3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .account-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0070f3; }
            .button { display: inline-block; background: #0070f3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 15px 0; }
            .steps { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Oakline Bank!</h1>
                <p>Your account has been successfully created</p>
            </div>
            <div class="content">
                <h2>Hello ${first_name} ${last_name},</h2>
                <p>Congratulations! Your banking application has been approved and your account is ready.</p>
                
                <div class="account-box">
                    <h3>🏦 Your Account Details</h3>
                    ${accountsList.map((accountNum, index) => `
                        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                            <p><strong>${typesList[index] || 'Account'} Account:</strong> ${accountNum}</p>
                            <p><strong>Routing Number:</strong> 075915826</p>
                            <p><strong>Status:</strong> Limited Access (pending verification)</p>
                        </div>
                    `).join('')}
                </div>

                <h3>🔐 Complete Your Enrollment</h3>
                <p>To access your online banking dashboard, please complete your enrollment by clicking the secure link below:</p>
                
                <div style="text-align: center;">
                    <a href="${enrollmentLink}" class="button">Complete Online Banking Setup</a>
                </div>

                <div class="steps">
                    <h4>What's Next:</h4>
                    <p>✅ <strong>Step 1:</strong> Click the enrollment link above<br/>
                    ✅ <strong>Step 2:</strong> Verify your identity with SSN and account number<br/>
                    ✅ <strong>Step 3:</strong> Create your online banking password<br/>
                    ✅ <strong>Step 4:</strong> Access your dashboard immediately</p>
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>🔒 Limited Mode:</strong> Your account starts in limited access mode. You can view your balance and account details, but transactions are disabled until our verification process is complete (typically 1-2 business days).</p>
                </div>

                <p>If you have any questions, please contact our support team.</p>
                
                <p>Welcome to the Oakline Bank family!</p>
                
                <hr style="margin: 30px 0;">
                <p style="font-size: 12px; color: #666;">
                    This enrollment link is secure and expires in 7 days. If you didn't apply for an Oakline Bank account, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `🎉 Welcome to Oakline Bank - ${accountsList.length > 1 ? `${accountsList.length} Accounts` : `Account #${accountsList[0]}`} Created!`,
      html: htmlEmail,
    });

    res.status(200).json({ message: 'Welcome email sent successfully' });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
}