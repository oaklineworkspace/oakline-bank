import { NextResponse } from 'next/server';

const allowedOrigins = [
  'https://oakline-frontend.vercel.app',
  'https://theoaklinebank.com',
  'https://www.theoaklinebank.com'
];

export function middleware(req) {
  const origin = req.headers.get('origin');
  const res = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
  }

  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: res.headers,
    });
  }

  return res;
}
