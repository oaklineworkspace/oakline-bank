# Deployment Guide – Oakline Bank

## 1. Overview
This document outlines how to deploy the Oakline Bank web application, including frontend, backend (API routes), and environment setup.

## 2. Prerequisites

- GitHub repository access: `oaklineworkspace/oakline-bank`
- Vercel account for hosting
- Supabase account for database, authentication, and storage
- Domain managed via GoDaddy
- Node.js >= 22.x installed locally
- npm or yarn package manager

## 3. Environment Variables

### Production
- `SMTP_HOST` – Host for Zoho SMTP server (`smtp.zoho.com`)  
- `SMTP_PORT` – SMTP SSL port (`465`)  
- `SMTP_USER` – Zoho email address (`info@theoaklinebank.com`)  
- `SMTP_PASS` – App password for Zoho email  
- `SMTP_FROM` – From email header (`info@theoaklinebank.com`)  

### Public Frontend
- `NEXT_PUBLIC_SITE_URL` – `https://oakline-bank.vercel.app`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Public Supabase API key  
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL  

### Admin/Backend
- `SUPABASE_SERVICE_KEY` – Admin service key with elevated permissions  

> **Note:** Do not commit `.env` to GitHub. Use Vercel Environment Variables for production.

## 4. Steps to Deploy

1. **Clone the repository**:
```bash
git clone https://github.com/oaklineworkspace/oakline-bank.git
cd oakline-bank


6.	Deploy to Vercel:

	•	Connect the GitHub repository in Vercel.
	•	Vercel automatically triggers a deployment on git push.
	•	Ensure your pages/ and pages/api/ structure is valid (all pages must export a React component by default).

	7.	Domain Setup:

	•	In GoDaddy, point your domain’s DNS to Vercel.
	•	Configure domain in Vercel project settings → Domains.

5. Verification
	•	Visit https://oakline-bank.vercel.app to confirm the deployment.
	•	Test key pages: index.js, signup.js, login.js, dashboard.js.
	•	Test API endpoints via /api/* paths.

6. Troubleshooting
	•	Deployment fails due to pages: Ensure all .js files in /pages/ export a React component as default. Empty files or non-component files cause build failures.
	•	Environment variable issues: Check Vercel settings; production variables must be set correctly.
	•	Supabase connection errors: Verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are correct.
