// Get DOM elements
const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

// Use Vercel environment variables (set in Vercel project settings)
const SUPABASE_URL = '%%SUPABASE_URL%%';         // Vercel env variable
const SUPABASE_ANON_KEY = '%%SUPABASE_ANON_KEY%%'; // Vercel env variable

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form values
  const first_name = document.getElementById("firstName").value.trim();
  const middle_name = document.getElementById("middleName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  messageDiv.style.color = 'red';
  messageDiv.textContent = 'Signing up...';

  try {
    // Sign up user in Supabase Auth
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/dashboard.html' // redirect after email confirmation
      }
    });

    if (signupError) {
      console.error("Signup Error:", signupError);
      messageDiv.textContent = "Signup Error: " + signupError.message;
      return;
    }

    // Insert profile into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          first_name,
          middle_name,
          last_name,
          email
        }
      ]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      messageDiv.textContent = "Profile Insert Error: " + profileError.message;
      return;
    }

    messageDiv.style.color = 'green';
    messageDiv.textContent = "Signup successful! Check your email to confirm your account.";

    signupForm.reset();
  } catch (err) {
    console.error("Unexpected Error:", err);
    messageDiv.textContent = "Unexpected Error: " + err.message;
  }
});
