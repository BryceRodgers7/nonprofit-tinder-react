# Resume Parser Application

An AI-powered resume parser built with Next.js, OpenAI GPT-4, Prisma, and Supabase. Upload resumes (PDF, DOCX, TXT) and automatically extract structured information that can be edited and saved to a database.

## Architecture

### Frontend (React/Next.js)
Located in `app/resume-parser/`:
- **page.tsx** - Main page integrating all components
- **components/FileUpload.tsx** - Drag-and-drop file upload
- **components/ResumeForm.tsx** - Editable form for resume data
- **components/SkillsInput.tsx** - Tag-based skills input
- **components/ResumeList.tsx** - Display saved resumes
- **components/LoadingSpinner.tsx** - Loading indicator

### Backend (Next.js API Routes)
Located in `app/api/`:
- **upload/route.ts** - File upload and text extraction (PDF, DOCX, TXT)
- **extract/route.ts** - OpenAI GPT-4 extraction and database save
- **resumes/route.ts** - List all resumes, create new resume
- **resumes/[id]/route.ts** - Get, update, delete specific resume

### Database
- **prisma/schema.prisma** - Database schema for Supabase PostgreSQL
- **lib/prisma.ts** - Prisma client singleton

## Setup Instructions

### 1. Install Dependencies
Already completed with:
```bash
npm install prisma @prisma/client openai pdf-parse mammoth
```

### 2. Configure Environment Variables
Copy the template and fill in your credentials:
```bash
# Copy the template
cp env-template.txt .env.local

# Edit .env.local with your values:
# - DATABASE_URL: Your Supabase PostgreSQL connection string
# - OPENAI_API_KEY: Your OpenAI API key
```

#### Getting Your Supabase DATABASE_URL:
1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Find "Connection String" section
4. Copy the URI format (starts with `postgresql://`)
5. Replace `[YOUR-PASSWORD]` with your actual database password

#### Getting Your OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into `.env.local`

### 3. Create Database Tables
Run Prisma migration to create the `resumes` table in Supabase:
```bash
npx prisma migrate dev --name init
```

This will create a new table with the following fields:
- id, fileName, fileType
- fullName, email, phone
- lastJob, lastCompany, yearsExperience
- technicalSkills (array)
- education, summary
- createdAt, updatedAt

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Access the Application
Navigate to: http://localhost:3000/resume-parser

## Features

- **File Upload**: Drag-and-drop or click to upload PDF, DOCX, or TXT files (max 10MB)
- **AI Extraction**: GPT-4 automatically extracts:
  - Personal info (name, email, phone)
  - Work experience (last job, company, years of experience)
  - Technical skills (array of technologies)
  - Education and professional summary
- **Editable Fields**: All extracted data can be manually edited
- **Database Storage**: Saves to Supabase PostgreSQL via Prisma
- **Resume History**: View, edit, and delete previously parsed resumes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **AI**: OpenAI GPT-4o-mini
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **File Processing**: 
  - PDF: pdf-parse
  - DOCX: mammoth
  - TXT: native Node.js

## File Structure

```
app/
├── api/ (BACKEND)
│   ├── upload/
│   │   └── route.ts          # File upload & text extraction
│   ├── extract/
│   │   └── route.ts          # OpenAI extraction & DB save
│   └── resumes/
│       ├── route.ts          # List/Create resumes
│       └── [id]/
│           └── route.ts      # Get/Update/Delete resume
│
└── resume-parser/ (FRONTEND)
    ├── page.tsx              # Main page
    └── components/
        ├── FileUpload.tsx
        ├── ResumeForm.tsx
        ├── SkillsInput.tsx
        ├── ResumeList.tsx
        └── LoadingSpinner.tsx

lib/
└── prisma.ts                 # Prisma client singleton

prisma/
└── schema.prisma             # Database schema

env-template.txt              # Environment variables template
```

## API Endpoints

### POST /api/upload
Upload a file and extract text.
- **Input**: FormData with 'file' field
- **Output**: { success, fileName, fileType, extractedText }

### POST /api/extract
Extract structured data using OpenAI and save to database.
- **Input**: { extractedText, fileName, fileType }
- **Output**: { success, resume }

### GET /api/resumes
Get all resumes (paginated).
- **Query Params**: page, limit
- **Output**: { success, resumes, pagination }

### GET /api/resumes/[id]
Get a specific resume by ID.
- **Output**: { success, resume }

### PUT /api/resumes/[id]
Update a resume.
- **Input**: Resume data object
- **Output**: { success, resume }

### DELETE /api/resumes/[id]
Delete a resume.
- **Output**: { success, message }

## Troubleshooting

### "OpenAI API key not configured"
Make sure your `.env.local` file has `OPENAI_API_KEY` set correctly.

### "Failed to connect to database"
- Verify your `DATABASE_URL` in `.env.local` is correct
- Make sure you've run `npx prisma migrate dev`
- Check that your Supabase project is active

### "No text could be extracted"
- Ensure the file is a valid PDF, DOCX, or TXT file
- Some PDFs (scanned images) may not contain extractable text
- Try uploading a different file

### File upload fails
- Check file size is under 10MB
- Ensure file extension is .pdf, .docx, or .txt

## Cost Considerations

- **OpenAI API**: Approximately $0.0001-0.001 per resume (using gpt-4o-mini)
- **Supabase**: Free tier includes 500MB database and 2GB bandwidth
- Consider implementing rate limiting for production use

## Next Steps

- Add user authentication
- Implement file storage in Supabase Storage
- Add batch processing for multiple resumes
- Export parsed data to CSV/JSON
- Add more detailed parsing (work history, projects, etc.)
- Implement search and filtering for saved resumes

## License

This project is part of a learning/demo application.

