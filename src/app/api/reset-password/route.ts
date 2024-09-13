import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    await prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });

  } catch (error) {
    let errorMessage = 'Internal Server Error';


    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
