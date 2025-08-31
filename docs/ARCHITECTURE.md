
# Project Architecture – Oakline Bank

## 1. Overview
Oakline Bank is a modern web banking application built with **Next.js**, **Supabase**, and **Vercel**. The project is organized for scalability, maintainability, and secure financial operations.

## 2. Folder Structure

### Root

oakline-bank/
├─ components/       # Reusable UI components (cards, forms, navbar, etc.)
├─ config/           # Configuration files (API keys, settings)
├─ docs/             # Documentation (API, architecture, deployment, security)
├─ infra/            # Infrastructure scripts (CI/CD, deployment configs)
├─ lib/              # Utility functions and helper modules
├─ pages/            # Next.js pages (UI routes)
│  ├─ admin/         # Admin dashboard pages
│  ├─ api/           # API routes / backend endpoints
│  ├─ index.js       # Home page
│  └─ …other pages
├─ public/           # Static assets (images, favicon, manifest, etc.)
├─ scripts/          # Automation scripts
├─ styles/           # Global and modular CSS
├─ tests/            # Test suites (unit, integration)
├─ .env              # Environment variables (local)
├─ README.md
└─ package.json

## 3. Pages

- **/pages/index.js** – Landing/home page  
- **/pages/signup.js** – Account registration  
- **/pages/login.js** – User login  
- **/pages/dashboard.js** – User dashboard  
- **/pages/admin/** – Admin panel pages for managing users, accounts, and transactions  
- **/pages/api/** – API routes for account management, authentication, transactions, and communications  

## 4. Components

Reusable UI elements:
- `AccountCard.js`, `CardItem.js` – Display account or card info  
- `Chart.js` – Visualize account and transaction data  
- `Features.js`, `Footer.js`, `Hero.js` – Page sections  
- `FormInput.js`, `Modal.js`, `Navbar.js` – Interactive components  
- `MessageItem.js`, `NotificationItem.js`, `TransactionItem.js` – List items  

## 5. Backend (API Routes)

- **Authentication & Accounts**: `auth.js`, `account-management.js`, `create-account.js`  
- **Transactions & Financial Products**: `transactions-management.js`, `financial-products.js`, `update-balance.js`  
- **Admin & Compliance**: `audit-compliance.js`, `updateEmailTemplates.js`  
- **Internationalization & Communication**: `internationalization.js`, `communication.js`  

All API routes are built as **Next.js API routes** and interact with **Supabase** as the database backend.  

## 6. Environment Variables

- Production:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`  
- Public Frontend:
  - `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_URL`  
- Admin Backend:
  - `SUPABASE_SERVICE_KEY`  

## 7. Deployment

- **Vercel** handles CI/CD for frontend and serverless API functions.  
- **Supabase** handles authentication, database, and storage.  
- **Domain** managed via GoDaddy.  

## 8. Security

- Environment variables are never committed to GitHub.  
- API routes validate user permissions and perform KYC/AML verification.  
- SMTP credentials are used securely via server-side operations.  
- HTTPS is enforced via Vercel and custom domain.  

## 9. Flow Summary

1. User submits an account application → confirmation message shown.  
2. Instant account number generated → welcome email sent.  
3. User sets up online access via Supabase Auth → limited mode account.  
4. Backend verification (KYC/AML) runs → full account activation.  
5. Dashboard unlocks full functionality: deposits, transfers, investments, crypto, etc.
