// BACKEND: Email signup notification API
// Sends notification emails when visitors sign up on the coming soon page

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Get environment variables
    const {
      GMAIL_SMTP_HOST,
      GMAIL_SMTP_PORT,
      GMAIL_SMTP_USER,
      GMAIL_SMTP_PASS,
      GMAIL_EMAIL_FROM,
      GIVIO_EMAIL_ADDR_INFO,
    } = process.env;

    // Check if all required env vars are present
    if (!GMAIL_SMTP_HOST || !GMAIL_SMTP_PORT || !GMAIL_SMTP_USER || !GMAIL_SMTP_PASS || !GMAIL_EMAIL_FROM || !GIVIO_EMAIL_ADDR_INFO) {
      console.error('Missing required email configuration environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: GMAIL_SMTP_HOST,
      port: parseInt(GMAIL_SMTP_PORT),
      secure: parseInt(GMAIL_SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: GMAIL_SMTP_USER,
        pass: GMAIL_SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: GMAIL_EMAIL_FROM,
      to: GIVIO_EMAIL_ADDR_INFO,
      subject: 'New Coming Soon Page Signup',
      text: `A new visitor has signed up to be notified when you launch!\n\nEmail: ${email}\n\nSubmitted at: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">New Coming Soon Page Signup</h2>
          <p>A new visitor has signed up to be notified when you launch!</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Email:</strong></p>
            <p style="margin: 10px 0; font-size: 18px; color: #4F46E5;">${email}</p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Thank you for signing up! We will notify you when we launch.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending signup notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification. Please try again later.' },
      { status: 500 }
    );
  }
}
