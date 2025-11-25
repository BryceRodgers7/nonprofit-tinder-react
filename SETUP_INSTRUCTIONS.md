# Non-Profit Profile Builder - Setup Instructions

## Overview

This application allows users to create and manage their non-profit organization profile. Users can upload proposal documents (PDF, DOCX, TXT) to automatically extract organization information using AI, or manually enter the data.

## Features

- **User Authentication**: Custom email/password authentication with JWT tokens
- **File Upload**: Upload proposal documents to S3 and extract text
- **AI Extraction**: GPT-4 powered extraction of non-profit organization data
- **Profile Management**: One profile per user with editable fields
- **Database Storage**: PostgreSQL (Supabase) with Prisma ORM

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenAI API account
- An AWS account with S3 bucket access

## Step-by-Step Setup

### 1. Install Dependencies

Dependencies have already been installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure Environment Variables

Copy the template and fill in your credentials:

```bash
# On Windows PowerShell:
Copy-Item env-template.txt .env.local

# On Mac/Linux:
cp env-template.txt .env.local
```

Open `.env.local` and configure the following:

#### Supabase Database URL

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to Settings → Database
4. Find "Connection string" section → URI tab
5. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

```env
DATABASE_URL="postgresql://postgres:your-password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
```

#### OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API keys
3. Create a new secret key
4. Copy and paste into `.env.local`

```env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### JWT Secret

Generate a secure random string for JWT token signing:

```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env
JWT_SECRET="your-generated-secret-here"
```

#### AWS S3 Configuration

1. Go to AWS Console → IAM
2. Create a new IAM user with S3 access
3. Create an S3 bucket for proposal storage
4. Get access key and secret key
5. Configure in `.env.local`:

```env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
```

### 3. Create Database Tables

Run Prisma migration to create the required tables:

```bash
npx prisma migrate dev --name init
```

This will create two tables:
- `app_users`: User accounts with authentication
- `profiles`: Non-profit organization profiles (one per user)

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### First Time Setup

1. Click "Create Account" on the homepage
2. Enter your name, email, and password
3. You'll be automatically logged in and redirected to your profile page

### Creating Your Profile

**Option 1: Upload a Proposal Document**
1. On the profile page, drag and drop a proposal document (PDF, DOCX, or TXT)
2. Wait for AI extraction (5-10 seconds)
3. Review and edit the extracted information
4. Click "Save Profile"

**Option 2: Manual Entry**
1. Skip the file upload section
2. Scroll down to "Organization Information"
3. Fill out all the fields manually
4. Click "Save Profile"

### Editing Your Profile

1. Log in to your account
2. Your profile will automatically load if it exists
3. Edit any fields
4. Click "Save Profile" to update

## Database Schema

### app_users Table
- `id`: UUID (primary key)
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `name`: User's full name
- `createdAt`, `updatedAt`: Timestamps

### profiles Table
- `id`: UUID (primary key)
- `userId`: Foreign key to app_users (one-to-one)
- `fileName`, `s3Key`, `s3Url`: File storage information
- `organizationName`: Organization name
- `ein`: Tax ID number
- `missionStatement`: Organization mission
- `yearFounded`: Year established
- `locationServed`: Service location
- `biggestAccomplishment`: Major achievement
- `oneSentenceSummary`: Brief description
- `legalDesignation`: Legal status (e.g., 501(c)(3))
- `primaryCauseAreas`: Array of cause areas
- `populations`: Array of populations served
- `geographicalFocus`: Geographic scope
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

### Authentication (BACKEND)
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side)
- `GET /api/auth/me` - Get current user info

### Profile (BACKEND)
- `GET /api/profile` - Get user's profile
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile
- `POST /api/profile/extract` - Extract data from proposal

### File Upload (BACKEND)
- `POST /api/upload` - Upload file, extract text, save to S3

## Frontend Pages

- `/` - Landing page (FRONTEND)
- `/auth/login` - Login page (FRONTEND)
- `/auth/register` - Registration page (FRONTEND)
- `/profile` - Main profile page (FRONTEND, protected)

## Troubleshooting

### "Unauthorized. Please log in."
- Your JWT token may have expired (7-day expiration)
- Log out and log back in

### "OpenAI API key not configured"
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Restart the development server

### "Failed to connect to database"
- Verify `DATABASE_URL` in `.env.local`
- Ensure your Supabase project is active
- Check that you've run `npx prisma migrate dev`

### "Failed to upload to S3"
- Verify AWS credentials in `.env.local`
- Check S3 bucket exists and has correct permissions
- Ensure IAM user has `PutObject`, `GetObject` permissions

### Prisma Client errors
- Run `npx prisma generate` to regenerate the client
- Run `npx prisma migrate dev` if schema has changed

## Security Notes

- ⚠️ Never commit `.env.local` to version control
- ⚠️ Keep your API keys and secrets private
- ⚠️ JWT tokens expire after 7 days
- ⚠️ Passwords are hashed with bcrypt (10 salt rounds)
- ⚠️ Users can only access their own profile

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Create new migration
npm run db:push      # Push schema without migration
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:generate  # Generate Prisma Client
```

## Production Deployment

Before deploying to production:

1. Set all environment variables in your hosting platform
2. Run `npm run build` to create optimized build
3. Ensure database migrations are run: `npx prisma migrate deploy`
4. Use strong, randomly generated `JWT_SECRET`
5. Enable HTTPS for secure authentication
6. Consider adding rate limiting to prevent abuse
7. Monitor OpenAI API usage to control costs

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments (marked as FRONTEND or BACKEND)
3. Check Prisma logs: `prisma studio` to view database
4. Review browser console for frontend errors
5. Review terminal logs for backend errors

---

**You're all set!** Visit http://localhost:3000 to get started.

