// Replace these with your Supabase project credentials
const SUPABASE_URL = "https://nrjdmgltshosdqccaymr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2hvc2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

// Helper: generate unique account number
function generateAccountNumber() {
  return "ACCT" + Math.floor(100000000 + Math.random() * 900000000);
}

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const first_name = document.getElementById("firstName").value.trim();
  const middle_name = document.getElementById("middleName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const ssn_or_id = document.getElementById("ssnOrId").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date_of_birth = document.getElementById("dob").value;
  const street_address = document.getElementById("street").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip_code = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Get selected account types
  const accountTypes = Array.from(document.querySelectorAll(".accountType:checked")).map(cb => cb.value);

  if (accountTypes.length === 0) {
    messageDiv.textContent = "Please select at least one account type.";
    return;
  }

  // Sign up the user in Supabase Auth
  const { user, error: signupError } = await supabase.auth.signUp({ email, password });

  if (signupError) {
    messageDiv.textContent = `Signup Error: ${signupError.message}`;
    return;
  }

  // Insert one row per selected account type
  for (const account_type of accountTypes) {
    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: user.id,
          first_name,
          middle_name,
          last_name,
          ssn_or_id,
          phone,
          date_of_birth,
          street_address,
          city,
          state,
          zip_code,
          country,
          account_type,
          account_number: generateAccountNumber(),
          routing_number: "075915826"
        }
      ]);

    if (error) {
      console.error("Insert Error:", error);
      messageDiv.textContent = `Error creating ${account_type} account: ${error.message}`;
      return;
    }
  }

  messageDiv.textContent = "Signup successful! You can now login.";
  signupForm.reset();
});
