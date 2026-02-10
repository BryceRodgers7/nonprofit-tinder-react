# Email Signup Configuration Guide

This guide explains how to configure the email notification system for the "Coming Soon" page.

## Overview

When visitors enter their email on the coming soon page, your Gmail account will automatically send a notification email to `info@givio-gives.com` with the visitor's email address.

## Gmail Setup

### 1. Enable 2-Step Verification (if not already enabled)

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left navigation
3. Under "How you sign in to Google," select "2-Step Verification"
4. Follow the prompts to enable it

### 2. Generate an App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left navigation
3. Under "How you sign in to Google," select "App passwords"
   - If you don't see "App passwords," you may need to enable 2-Step Verification first
4. Click "Select app" and choose "Mail"
5. Click "Select device" and choose "Other (Custom name)"
6. Enter a name like "Nonprofit Tinder App"
7. Click "Generate"
8. **Copy the 16-character password** (you won't be able to see it again)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Email Configuration (for coming soon page signups)
GMAIL_SMTP_HOST="smtp.gmail.com"
GMAIL_SMTP_PORT="587"
GMAIL_SMTP_USER="your-gmail@gmail.com"        # Your Gmail address
GMAIL_SMTP_PASS="xxxx xxxx xxxx xxxx"         # The 16-character App Password
GMAIL_EMAIL_FROM="your-gmail@gmail.com"       # Your Gmail address
GIVIO_EMAIL_ADDR_INFO="info@givio-gives.com"  # Where notifications are sent
```

**Important Notes:**
- Use the **App Password** for `GMAIL_SMTP_PASS`, not your regular Gmail password
- Port 587 uses STARTTLS encryption (recommended)
- Alternatively, you can use port 465 for SSL encryption

## Testing

After configuration:

1. Run your development server: `npm run dev`
2. Open the coming soon page
3. Enter a test email address
4. Click "Notify Me"
5. Check `info@givio-gives.com` for the notification email

## Troubleshooting

### "Authentication failed" error
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google account

### "Connection timeout" error
- Check your SMTP host and port settings
- Ensure your firewall/network allows outbound SMTP connections

### No email received
- Check the spam/junk folder at `info@givio-gives.com`
- Verify the `GIVIO_EMAIL_ADDR_INFO` environment variable is set correctly
- Check the server logs for error messages

## Security Reminders

- Never commit your `.env.local` file to git
- Keep your App Password secure
- Rotate your App Password periodically
- Use environment variables in production (Vercel, etc.)
