
# Deployment Guide - Platform Agnostic

This enrollment system is designed to work on **any deployment platform** (Replit, Render, Vercel, Railway, etc.) with minimal configuration.

## Environment Variables Required

Set these in your deployment platform's environment variable settings:

### Required Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key (keep secret!)
- `SMTP_HOST` - Your email SMTP host
- `SMTP_PORT` - Your email SMTP port
- `SMTP_USER` - Your email SMTP username
- `SMTP_PASS` - Your email SMTP password
- `SMTP_FROM` - Your email "from" address

### Optional Variables
- `NEXT_PUBLIC_SITE_URL` - Your deployment URL (auto-detected if not set)

## Platform-Specific Setup

### Replit
1. Set environment variables in Secrets
2. Deploy using Replit Deployments
3. The system will auto-detect your Replit URL

### Render
1. Set environment variables in Render dashboard
2. Deploy from GitHub/GitLab
3. The system will auto-detect your Render URL

### Vercel
1. Set environment variables in Vercel project settings
2. Deploy from Git repository
3. The system will auto-detect your Vercel URL

### Railway
1. Set environment variables in Railway dashboard
2. Deploy from repository
3. The system will auto-detect your Railway URL

## Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to **Authentication → URL Configuration**
3. Add your deployment URL to **Redirect URLs**:
   - `https://your-deployment-url.com/enroll`
   - `https://your-deployment-url.com/login`
   - `https://your-deployment-url.com/*` (wildcard for all routes)

## How It Works

The enrollment system automatically detects the current deployment URL using:
1. `NEXT_PUBLIC_SITE_URL` environment variable (if set)
2. Request headers (`x-forwarded-proto`, `x-forwarded-host`)
3. Client-side `window.location.origin`

This means you can deploy the same codebase to multiple environments without changing any code.

## Testing

After deployment:
1. Submit a test application at `/apply`
2. Check that the welcome email contains the correct deployment URL
3. Click the enrollment link and verify it redirects to your deployment
4. Complete enrollment and verify login works

## Troubleshooting

**Enrollment links not working?**
- Verify Supabase Redirect URLs include your deployment domain
- Check that environment variables are set correctly
- Ensure SMTP settings are configured for email delivery

**Wrong URL in emails?**
- Set `NEXT_PUBLIC_SITE_URL` explicitly in environment variables
- Check deployment platform's proxy/forwarding headers are enabled
