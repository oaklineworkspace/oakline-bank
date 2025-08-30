
import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST': // Create User and Generate Account Number
      const { email, firstName, lastName } = req.body;
      
      try {
        // Insert user application data into 'applications' table
        const { data, error } = await supabase
          .from('applications')
          .insert([{ email, firstName, lastName, status: 'Pending' }]);

        if (error) throw error;

        // Generate an account number (this can be any format you prefer)
        const accountNumber = `ACC-${Date.now()}`;

        // Send Welcome Email with Account Number and Enroll Link
        await sendWelcomeEmail(email, accountNumber);

        res.status(200).json({ message: 'Application received', accountNumber });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).end(); // Method Not Allowed
  }
}

async function sendWelcomeEmail(email, accountNumber) {
  const subject = "Welcome to Oakline Bank!";
  const message = `Your account has been created with the account number: ${accountNumber}. 
  Please visit the following link to set up your online banking access.`;

  // Send email logic here (using Zoho SMTP)
  await sendZohoEmail(email, subject, message);
}

async function sendZohoEmail(email, subject, message) {
  // Your Zoho email sending logic here
  console.log(`Sending email to ${email} with subject: ${subject} and message: ${message}`);
}
