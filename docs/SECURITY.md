
# Security Policy – Oakline Bank

## 1. Overview
This document outlines the security measures implemented in the Oakline Bank web application, including user authentication, data protection, and operational best practices.

---

## 2. User Authentication & Access Control

- **Supabase Auth**: All users (customers & admins) are authenticated via Supabase.
- **Password Security**: Passwords are hashed and salted using Supabase's secure algorithms.
- **Multi-Factor Authentication (MFA)**: Optional for users, enabled via `mfa-setup.js`.
- **Role-Based Access Control (RBAC)**:
  - Admin pages (e.g., `pages/admin/*`) are accessible only by authenticated admin accounts.
  - Customer pages restrict access based on account status (`limited` vs. `fully active`).

---

## 3. Data Protection

- **Sensitive Data**:
  - Social Security Numbers, dates of birth, and account details are encrypted at rest using Supabase.
  - No sensitive data is stored in the frontend.
- **Environment Variables**:
  - All secrets (SMTP credentials, Supabase service key) are stored securely in Vercel environment variables.
- **HTTPS/SSL**:
  - The site is deployed with HTTPS via Vercel by default.
  - All API requests are made over HTTPS.

---

## 4. API Security

- **Server-Side Validation**: Every `/api/*` endpoint validates input data before processing.
- **Authentication**: Endpoints requiring sensitive operations (e.g., `update-balance.js`, `account-management.js`) check for proper auth tokens.
- **Rate Limiting**: API endpoints are protected from brute-force attacks by limiting request frequency.

---

## 5. Email Security

- **SMTP via Zoho**: Emails (account confirmation, notifications) are sent via Zoho SMTP using SSL on port 465.
- **Email Headers**:
  - `From` address is always `info@theoaklinebank.com`.
  - Emails include unique, one-time verification links for account activation.

---

## 6. Backend Verification

- **KYC/AML Compliance**:
  - All account applications undergo backend verification.
  - Accounts remain in `limited mode` until verified.
  - Verification prevents unauthorized transactions and reduces fraud risk.

---

## 7. Monitoring & Logging

- **Admin Logs**:
  - Admin actions are logged via `admin-logs.js` and stored securely in the database.
- **Error Reporting**:
  - Failed API requests are captured and monitored for unusual activity.
- **Transaction Monitoring**:
  - Suspicious activity triggers alerts via the notifications system.

---

## 8. Best Practices for Developers

- Do **not** commit sensitive environment variables or API keys.
- Use `.env.local` for local development and Vercel environment variables for production.
- Ensure all pages in `/pages/` export a React component; otherwise, builds will fail.
- Keep dependencies up-to-date and monitor for security advisories.

---

## 9. Incident Response

- Security incidents are tracked and resolved via internal reporting channels.
- Critical vulnerabilities are patched immediately.
- Users are notified of potential data breaches according to compliance requirements.

---

*Document last updated: [Insert Date]*  
