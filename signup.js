import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://nrjdmgltshosdqccaymr.supabase.co', // your project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk' // anon key
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

  if (!firstName || !lastName || !email || !password) {
    messageDiv.textContent = 'Please fill in all required fields.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    messageDiv.textContent = 'Please enter a valid email.'
    return
  }

  if (password.length < 6) {
    messageDiv.textContent = 'Password must be at least 6 characters.'
    return
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://oakline-bank.vercel.app/login',
      data: { first_name: firstName, middle_name: middleName, last_name: lastName }
    }
  })

  if (error) {
    messageDiv.textContent = 'Error: ' + error.message
  } else {
    messageDiv.textContent = 'Verification email sent! Please check your inbox.'
    form.reset()
  }
})
