export default () => ({
  port: parseInt(process.env.API_PORT ?? process.env.PORT ?? '3001', 10),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secretKey: process.env.SUPABASE_SECRET_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-ledgerly-jwt-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? 'Ledgerly <onboarding@resend.dev>',
});
