// Replace these with your Supabase project credentials
const SUPABASE_URL = "https://nrjdmgltshosdqccaymr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2hvc2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect user info
  const firstName = document.getElementById("firstName").value.trim();
  const middleName = document.getElementById("middleName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const ssnOrId = document.getElementById("ssnOrId").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const street = document.getElementById("street").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const country = document.getElementById("country").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const accountTypes = Array.from(document.querySelectorAll(".accountType:checked")).map(cb => cb.value);

  if (accountTypes.length === 0) {
    messageDiv.textContent = "Please select at least one account type.";
    return;
  }

  // 1️⃣ Create Auth user
  const { user, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) {
    messageDiv.textContent = `Error: ${authError.message}`;
    return;
  }

  const userId = user.id;

  // 2️⃣ Insert one row per selected account type
  const insertPromises = accountTypes.map(async (type) => {
    const accountNumber = generateAccountNumber();
    return await supabase.from("accounts").insert([{
      user_id: userId,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      ssn_or_id: ssnOrId,
      phone: phone,
      date_of_birth: dob,
      street_address: street,
      city: city,
      state: state,
      zip_code: zip,
      country: country,
      account_type: type,
      account_number: accountNumber
    }]);
  });

  try {
    await Promise.all(insertPromises);
    messageDiv.textContent = "Signup successful! Accounts created.";
    signupForm.reset();
  } catch (err) {
    messageDiv.textContent = `Error inserting accounts: ${err.message}`;
  }
});

// Utility: Generate a 6-digit unique account number
function generateAccountNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Ensure user is logged in and show dashboard
async function loadDashboard() {
  const user = supabase.auth.user();
  if (!user) {
    window.location.href = "login.html"; // Redirect if not logged in
    return;
  }

  // Display basic user info
  const { data: accounts, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching accounts:", error);
    return;
  }

  const userInfoDiv = document.getElementById("userInfo");
  userInfoDiv.innerHTML = `
    <p>Hello, ${accounts[0].first_name} ${accounts[0].last_name} from ${accounts[0].country}</p>
  `;

  // Populate accounts table
  const tbody = document.getElementById("accountsTable").querySelector("tbody");
  tbody.innerHTML = "";
  accounts.forEach(account => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${account.account_type}</td>
      <td>${account.account_number}</td>
      <td>${account.routing_number}</td>
      <td>$${parseFloat(account.balance).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Call loadDashboard if on dashboard.html
if (document.getElementById("accountsTable")) {
  loadDashboard();
}

// Logout functionality
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}
