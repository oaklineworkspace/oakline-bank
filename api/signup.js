import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function signUpUser({ email, password, firstName, middleName, lastName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/login', // where user goes after confirming
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

  return {
    success: true,
    message: 'Verification email sent. Please check your inbox to confirm your account.'
  }
}
