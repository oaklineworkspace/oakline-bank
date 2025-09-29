import { NextResponse } from 'next/server';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://theoaklinebank.com',
  'https://www.theoaklinebank.com',
  'https://oakline-frontend.vercel.app'
];

export function middleware(request) {
  // Only apply CORS to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the origin from the request headers
  const origin = request.headers.get('origin');
  
  // Check if the origin is in our allowed list
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin);
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
    
    return response;
  }

  // For non-OPTIONS requests, continue to the API route
  const response = NextResponse.next();
  
  // Add CORS headers to the response
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Configure which paths this middleware should run on
export const config = {
  matcher: '/api/:path*'
};
