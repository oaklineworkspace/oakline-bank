
const nodemailer = require('nodemailer');

// SMTP transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Current working Replit URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oaklineworkspac-oakline-bank.repl.co';

// Test user info - replace with actual application data
const testApplicationId = "1"; // Replace with actual application ID from your database
const userEmail = "chrishite2323@gmail.com";
const userFullName = "Christopher Lee Hite";

// Function to send enrollment email
async function sendEnrollmentEmail() {
  try {
    // Generate enrollment token
    const enrollmentToken = `enroll_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // In a real implementation, you would:
    // 1. Store this token in the enrollments table
    // 2. Get actual application data from the database
    
    const enrollLink = `${siteUrl}/enroll?token=${enrollmentToken}&application_id=${testApplicationId}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: "Complete Your Oakline Bank Enrollment",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0070f3;">Welcome to Oakline Bank, ${userFullName}!</h2>
          <p>Your application has been processed and your accounts are ready for activation.</p>
          
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
            <li>Provide your Social Security Number (SSN) or Government ID Number</li>
            <li>Select one of your account numbers</li>
            <li>Agree to our Terms of Service and Privacy Policy</li>
          </ul>
          
          <p><em>This link will expire in 7 days for security purposes.</em></p>
          
          <p>If you have any questions, feel free to contact us.</p>
          <p>Thank you,<br/>Oakline Bank</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Enrollment email sent to ${userEmail}: ${info.response}`);
    console.log(`Enrollment link: ${enrollLink}`);
  } catch (err) {
    console.error("Error sending enrollment email:", err);
  }
}

// Run the function
sendEnrollmentEmail();
