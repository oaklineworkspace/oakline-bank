import { createClient } from '@supabase/supabase-js'

// Initialize Supabase with your Vercel env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Function to sign up a user with email confirmation
export async function signUpUser({ email, password, firstName, middleName, lastName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/confirm', // Redirect after confirmation
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName
      }
    }
  })

  if (error) {
    console.error('Signup error:', error.message)
    return { success: false, message: error.message }
  }

  console.log('Confirmation email sent to:', email)
  return { success: true, message: 'Confirmation email sent. Please check your inbox!' }
}
