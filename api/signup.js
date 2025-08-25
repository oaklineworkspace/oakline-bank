// signup.js
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using your Vercel env variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Get form and message div
const form = document.getElementById('signupForm')
const messageDiv = document.getElementById('message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Collect and trim inputs
  const firstName = document.getElementById('firstName').value.trim()
  const middleName = document.getElementById('middleName').value.trim() || ''
  const lastName = document.getElementById('lastName').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value.trim()

  // Frontend validation
  if (!firstName || !lastName || !email || !password) {
    messageDiv.textContent = 'Please fill in all required fields.'
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    messageDiv.textContent = 'Please enter a valid email address.'
    return
  }

  if (password.length < 6) {
    messageDiv.textContent = 'Password must be at least 6 characters.'
    return
  }

  // Sign up user with Supabase
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/login',
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName
        }
      }
    })

    if (error) {
      messageDiv.textContent = 'Error: ' + error.message
      return
    }

    messageDiv.textContent = 'Verification email sent! Please check your inbox to confirm your account.'
    form.reset()
  } catch (err) {
    messageDiv.textContent = 'Unexpected error: ' + err.message
  }
})
