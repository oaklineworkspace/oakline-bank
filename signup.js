import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase client using your public keys
const supabase = createClient(
  'https://nrjdmgltshosdqccaymr.supabase.co', // your NEXT_PUBLIC_SUPABASE_URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk' // your NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const form = document.getElementById('signupForm')
const messageDiv = document.getElementById('message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

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

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://oakline-bank.vercel.app/login', // redirect after confirmation
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName
      }
    }
  })

  if (error) {
    messageDiv.textContent = 'Error: ' + error.message
  } else {
    messageDiv.textContent = 'Verification email sent! Please check your inbox.'
    form.reset()
  }
})
