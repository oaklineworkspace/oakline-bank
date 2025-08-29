export default async function handler(req, res) {
  // Accept both GET and POST requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/admin/templates/email'
  const apiKey = process.env.SUPABASE_SERVICE_KEY

  const body = {
    confirmation: {
      subject: 'Welcome to Oakline Bank – Confirm Your Email',
      html: `Hi {{user.email}},<br><br>
      Thank you for signing up with Oakline Bank! Click here to confirm:<br>
      {{ .ConfirmationURL }}<br><br>
      Best regards,<br>
      The Oakline Bank Team<br>
      info@theoaklinebank.com`
    },
    reset_password: {
      subject: 'Oakline Bank – Password Reset Request',
      html: `Hi {{user.email}},<br><br>
      Click the link below to reset your password:<br>
      {{ .ConfirmationURL }}<br><br>
      If you did not request this, contact info@theoaklinebank.com immediately.<br>
      Thank you,<br>
      The Oakline Bank Team`
    },
    magic_link: {
      subject: 'Your Oakline Bank Magic Login Link',
      html: `Hi {{user.email}},<br><br>
      Click below to log in instantly with your magic link:<br>
      {{ .MagicLinkURL }}<br><br>
      If you did not request this, ignore this email.<br>
      The Oakline Bank Team<br>
      info@theoaklinebank.com`
    }
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    res.status(200).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
