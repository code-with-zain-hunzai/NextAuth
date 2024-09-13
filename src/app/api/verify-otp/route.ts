import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';

export async function POST(request: Request) {
  const { email, otp } = await request.json();
  
  // Query OTP by email
  const storedOtp = await prisma.oTP.findUnique({ where: { email } });
  
  if (!storedOtp || storedOtp.otp !== otp || new Date() > storedOtp.expiresAt) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  return NextResponse.json({ message: 'OTP verified' });
}
