# Resume Parser - Setup Guide

Follow these steps to get your Resume Parser application up and running.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- An OpenAI account with API access

## Step-by-Step Setup

### Step 1: Configure Environment Variables

1. Copy the environment template:
```bash
# On Windows PowerShell:
Copy-Item env-template.txt .env.local

# On Mac/Linux:
cp env-template.txt .env.local
```

2. Open `.env.local` in your text editor

### Step 2: Get Your Supabase Database URL

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project (or create a new one)
3. In the left sidebar, click on **Settings** (gear icon)
4. Click on **Database**
5. Scroll down to **Connection string** section
6. Select **URI** tab
7. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
8. Replace `[YOUR-PASSWORD]` with your actual database password
9. Paste this into `.env.local` as the `DATABASE_URL` value

**Example:**
```env
DATABASE_URL="postgresql://postgres:mySecretPass123@db.abcdefgh.supabase.co:5432/postgres"
```

### Step 3: Get Your OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Click on your profile icon (top right)
4. Select **API keys**
5. Click **Create new secret key**
6. Give it a name (e.g., "Resume Parser")
7. Copy the key (it starts with `sk-`)
8. Paste this into `.env.local` as the `OPENAI_API_KEY` value

**Example:**
```env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Step 4: Create Database Tables

Run the Prisma migration to create the necessary tables in your Supabase database:

```bash
npm run db:migrate
```

When prompted, enter a name for the migration (e.g., "init" or "initial_setup")

This will:
- Create a `resumes` table in your Supabase database
- Generate the Prisma Client for type-safe database access

### Step 5: Verify Database Setup (Optional)

You can use Prisma Studio to view your database:

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can see your `resumes` table.

### Step 6: Start the Development Server

```bash
npm run dev
```

### Step 7: Open the Application

Open your browser and navigate to:
```
http://localhost:3000/resume-parser
```

## Testing the Application

1. **Upload a Resume**:
   - Drag and drop a resume file (PDF, DOCX, or TXT)
   - Or click to select a file
   - Maximum file size: 10MB

2. **Wait for Processing**:
   - The app will extract text from the file
   - GPT-4 will analyze and extract structured data
   - This usually takes 3-10 seconds

3. **Edit the Information**:
   - Review the extracted data
   - Make any necessary corrections
   - Add or remove skills using the tag input
   - Click "Save Changes"

4. **View Saved Resumes**:
   - All parsed resumes appear in the right panel
   - Click "Edit" to modify a resume
   - Click "Delete" to remove a resume

## Troubleshooting

### Error: "OpenAI API key not configured"

**Problem**: The OpenAI API key is missing or incorrect.

**Solution**:
1. Check that your `.env.local` file exists
2. Verify the `OPENAI_API_KEY` value starts with `sk-`
3. Make sure there are no extra spaces or quotes
4. Restart the dev server (`npm run dev`)

### Error: "Failed to connect to database"

**Problem**: Can't connect to Supabase database.

**Solution**:
1. Verify your `DATABASE_URL` in `.env.local`
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual password
3. Check that your Supabase project is active
4. Try running `npm run db:push` to sync the schema

### Error: "No text could be extracted from the file"

**Problem**: The uploaded file doesn't contain readable text.

**Solution**:
- If it's a PDF: Make sure it's a text-based PDF, not a scanned image
- Try a different file
- Check that the file is not corrupted

### Error: "Prisma Client not found"

**Problem**: Prisma Client hasn't been generated.

**Solution**:
```bash
npm run db:generate
```

### Database Out of Sync

If you make changes to `prisma/schema.prisma`:

```bash
# Create a new migration
npm run db:migrate

# OR push schema directly (without migration)
npm run db:push
```

## File Structure Reference

```
📁 Project Root
├── 📁 app/
│   ├── 📁 api/ (BACKEND)
│   │   ├── 📁 upload/
│   │   │   └── route.ts ─── File upload & text extraction
│   │   ├── 📁 extract/
│   │   │   └── route.ts ─── AI extraction & DB save
│   │   └── 📁 resumes/
│   │       ├── route.ts ─── List/create resumes
│   │       └── 📁 [id]/
│   │           └── route.ts ─── Get/update/delete resume
│   └── 📁 resume-parser/ (FRONTEND)
│       ├── page.tsx ─────── Main page
│       └── 📁 components/
│           ├── FileUpload.tsx
│           ├── ResumeForm.tsx
│           ├── SkillsInput.tsx
│           ├── ResumeList.tsx
│           └── LoadingSpinner.tsx
├── 📁 lib/
│   └── prisma.ts ───────── Database client
├── 📁 prisma/
│   └── schema.prisma ───── Database schema
├── 📁 types/
│   └── resume.ts ───────── TypeScript types
├── .env.local ──────────── Your credentials (DO NOT COMMIT)
├── env-template.txt ────── Template for env vars
└── package.json ────────── Dependencies & scripts
```

## Available NPM Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Create and run database migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:generate` - Generate Prisma Client

## Cost Information

### OpenAI Costs
- Model used: `gpt-4o-mini`
- Approximate cost: $0.0001 - $0.001 per resume
- 1000 resumes ≈ $0.10 - $1.00

### Supabase Costs
- Free tier includes:
  - 500MB database storage
  - 2GB bandwidth
  - Unlimited API requests

## Next Steps

Once everything is working, consider:

1. **Add Authentication**: Protect the page with user login
2. **Add File Storage**: Store original resume files in Supabase Storage
3. **Batch Processing**: Upload multiple resumes at once
4. **Export Data**: Download parsed data as CSV or JSON
5. **Advanced Parsing**: Extract full work history, projects, certifications
6. **Search & Filter**: Search through saved resumes by skills, experience, etc.

## Need Help?

Check `RESUME_PARSER_README.md` for:
- Detailed architecture information
- API endpoint documentation
- Tech stack details
- Advanced features

## Security Notes

- ⚠️ Never commit `.env.local` to Git
- ⚠️ Keep your API keys secret
- ⚠️ For production, add rate limiting
- ⚠️ For production, add user authentication
- ⚠️ Monitor your OpenAI API usage

---

**You're all set!** 🎉

Visit http://localhost:3000/resume-parser and start parsing resumes!

