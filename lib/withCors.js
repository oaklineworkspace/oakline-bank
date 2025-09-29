import NextCors from 'nextjs-cors';

export default function withCors(handler) {
  return async (req, res) => {
    await NextCors(req, res, {
      origin: [
        'https://theoaklinebank.com',
        'https://www.theoaklinebank.com',
        'https://oakline-frontend.vercel.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    return handler(req, res);
  };
}
