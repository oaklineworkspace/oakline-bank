const nodemailer = require('nodemailer');

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Current working Replit URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// User info
const tempUserId = "30f5b6d4-8ba4-480a-9d68-302bf74974ad";
const userEmail = "chrishite2323@gmail.com";
const userFullName = "Christopher Lee Hite";

// Function to send enrollment email
async function sendEnrollmentEmail() {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: userEmail,
      subject: "Complete Your Oakline Bank Enrollment",
      html: `
        <p>Hello ${userFullName},</p>
        <p>Welcome to Oakline Bank! Please complete your enrollment by clicking the link below:</p>
        <p><a href="${siteUrl}/enroll?temp_user_id=${tempUserId}">Enroll Now</a></p>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Thank you,<br/>Oakline Bank</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Enrollment email sent to ${userEmail}: ${info.response}`);
  } catch (err) {
    console.error("Error sending enrollment email:", err);
  }
}

// Run the function
sendEnrollmentEmail();