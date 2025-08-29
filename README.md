# Oakline Bank

Bank project – Oakline Bank.  
[Live Site](https://oakline-bank.vercel.app)

---

## Deployment

Project structure is designed for scalability and modern banking needs.

---

## Supabase Database

- **Users** → auth, profile, KYC  
- **Accounts** → deposits, withdrawals, transfers  
- **Transactions** → history  
- **Loans** → applications & approvals  
- **Investments** → user investments  
- **Crypto** → portfolios  
- **Notifications** → messages & alerts  
- **Audit** → logs of all actions  
- **Compliance/KYC** → documents & verification  
- **Internationalization** → exchange rates, currencies  

---

## Flow Summary

💙 **User Pages** → call → 🟠 **API** → read/write → Supabase  
🟢 **Admin Pages** → call → 🟠 **API** → read/write → Supabase  
🟣 **Compliance / International** → call → 🟣 **API** → read/write → Supabase  

---

## Folder Overview

```bash
/pages              # UI Pages for users and admin
/pages/admin        # Admin-specific pages
/pages/api          # Server-side API logic
/components         # Reusable UI components
/lib                # Shared business logic / helpers / security
/styles             # CSS modules & global styles
/images             # Static images
/public             # Public assets
/config             # Env vars, feature flags, DB config
/scripts            # Migrations, backups, seeding
/infra              # Deployment & infrastructure (Docker, Kubernetes, Terraform)
/.github/workflows  # CI/CD pipelines
