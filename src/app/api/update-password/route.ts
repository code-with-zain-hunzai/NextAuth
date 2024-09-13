import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, newPassword } = await request.json();
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: 'Password updated successfully' });
}
