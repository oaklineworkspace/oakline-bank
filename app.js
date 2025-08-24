// Replace with your Supabase details
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const accountTypeSelect = document.getElementById('account-type');
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

const dashboard = document.getElementById('dashboard');
const userEmail = document.getElementById('user-email');
const balanceEl = document.getElementById('balance');
const accountNumberEl = document.getElementById('account-number');
const accountTypeDisplay = document.getElementById('account-type-display');
const routingNumberEl = document.getElementById('routing-number');
const amountInput = document.getElementById('amount');
const depositBtn = document.getElementById('deposit');
const withdrawBtn = document.getElementById('withdraw');

let currentUserId = null;
const BANK_ROUTING_NUMBER = "075915826";  // Permanent routing number

// Generate unique account number
function generateAccountNumber() {
  return '10' + Math.floor(100000000 + Math.random() * 900000000);
}

// Signup
if(signupBtn) {
  signupBtn.onclick = async () => {
    const { user, error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    });
    if (error) return alert(error.message);

    const accountNumber = generateAccountNumber();
    const accountType = accountTypeSelect.value;

    const { err } = await supabase
      .from('accounts')
      .insert([{
        user_id: user.id,
        account_number: accountNumber,
        account_type: accountType,
        balance: 0,
        full_name: null,
        phone: null,
        address: null,
        date_of_birth: null,
        profile_picture_url: null
      }]);

    if (err) alert(err.message);
    else alert(`Account created! Your account number: ${accountNumber}`);
  };
}

// Login
if(loginBtn) {
  loginBtn.onclick = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    });
    if (error) return alert(error.message);

    currentUserId = data.user.id;
    window.location.href = "dashboard.html";
  };
}

// Dashboard functionality
if(dashboard) {
  async function loadDashboard() {
    const session = await supabase.auth.getSession();
    const { data: { session: currentSession } } = session;
    currentUserId = currentSession.user.id;

    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', currentUserId)
      .single();

    if (data) {
      userEmail.textContent = currentSession.user.email;
      balanceEl.textContent = data.balance;
      accountNumberEl.textContent = data.account_number;
      accountTypeDisplay.textContent = data.account_type;
      routingNumberEl.textContent = BANK_ROUTING_NUMBER;
    }
  }
  loadDashboard();

  // Deposit
  depositBtn.onclick = async () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return alert('Enter valid amount');

    await supabase
      .from('accounts')
      .update({ balance: supabase.raw('balance + ?', [amount]) })
      .eq('user_id', currentUserId);

    loadDashboard();
  };

  // Withdraw
  withdrawBtn.onclick = async () => {
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) return alert('Enter valid amount');

    const { data } = await supabase
      .from('accounts')
      .select('balance')
      .eq('user_id', currentUserId)
      .single();

    if (data.balance < amount) return alert('Insufficient funds');

    await supabase
      .from('accounts')
      .update({ balance: supabase.raw('balance - ?', [amount]) })
      .eq('user_id', currentUserId);

    loadDashboard();
  };

  // Logout
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  };
}
