// BACKEND: Email signup notification API
// Sends notification emails when visitors sign up on the coming soon page

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

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
      RESEND_API_KEY,
      RESEND_EMAIL_FROM,
    } = process.env;

    // Check if all required env vars are present
    if (!GMAIL_SMTP_HOST || !GMAIL_SMTP_PORT || !GMAIL_SMTP_USER || !GMAIL_SMTP_PASS || !GMAIL_EMAIL_FROM || !GIVIO_EMAIL_ADDR_INFO || !RESEND_API_KEY || !RESEND_EMAIL_FROM) {
      console.error('Missing required email configuration environment variables');
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 500 }
      );
    }

    // --- Gmail: notify us of the new signup ---
    try {
      const transporter = nodemailer.createTransport({
        host: GMAIL_SMTP_HOST,
        port: parseInt(GMAIL_SMTP_PORT),
        secure: parseInt(GMAIL_SMTP_PORT) === 465,
        auth: {
          user: GMAIL_SMTP_USER,
          pass: GMAIL_SMTP_PASS,
        },
      });

      const internalMailOptions = {
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

      const gmailResult = await transporter.sendMail(internalMailOptions);
      console.log('[Gmail] Internal notification sent. MessageId:', gmailResult.messageId, '| Response:', gmailResult.response);
    } catch (gmailError) {
      console.error('[Gmail] Failed to send internal notification:', gmailError);
    }

    // --- Resend: confirmation email to the visitor ---
    try {
      const resend = new Resend(RESEND_API_KEY);

      const { data: resendData, error: resendError } = await resend.emails.send({
        from: RESEND_EMAIL_FROM,
        to: email,
        subject: "You're on the list! Givio is coming soon",
        text: `Thanks for your interest in Givio!\n\nYou're on our early access list. We'll notify you as soon as we launch.\n\nStay tuned!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px;">You're on the list! 🚀</h1>
            </div>
            <div style="background-color: #F9FAFB; padding: 40px; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; font-size: 16px;">Thanks for your interest in <strong>Givio</strong>!</p>
              <p style="color: #374151; font-size: 16px;">You're on our early access list. We'll send you a notification as soon as we launch.</p>
              <p style="color: #6B7280; font-size: 14px; margin-top: 32px;">Stay tuned for something amazing!</p>
            </div>
          </div>
        `,
      });

      if (resendError) {
        console.error('[Resend] Failed to send visitor confirmation. Error:', JSON.stringify(resendError));
      } else {
        console.log('[Resend] Visitor confirmation sent. Id:', resendData?.id);
      }
    } catch (resendException) {
      console.error('[Resend] Exception while sending visitor confirmation:', resendException);
    }

    return NextResponse.json(
      { message: 'Thank you for signing up! We will notify you when we launch.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in signup handler:', error);
    return NextResponse.json(
      { error: 'Failed to process signup. Please try again later.' },
      { status: 500 }
    );
  }
}
