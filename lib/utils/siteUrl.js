
// Detect the current site URL dynamically across all environments
export function getSiteUrl() {
  // Priority 1: Use environment variable if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Priority 2: Server-side fallback using host headers
  if (typeof window === 'undefined') {
    // This runs on the server, we'll need to pass headers from API routes
    return null;
  }

  // Priority 3: Client-side detection using window.location
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
}

// Get site URL from request headers (for API routes)
export function getSiteUrlFromRequest(req) {
  // Priority 1: Use environment variable if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Priority 2: Extract from request headers
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  if (host) {
    return `${protocol}://${host}`;
  }

  // Priority 3: Fallback to localhost for development
  return 'http://localhost:5000';
}
