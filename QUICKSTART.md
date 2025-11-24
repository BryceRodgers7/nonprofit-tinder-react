# Resume Parser - Quick Start

## 🚀 Get Running in 5 Minutes

### 1. Environment Setup (2 minutes)
```bash
# Copy the environment template
Copy-Item env-template.txt .env.local   # Windows PowerShell
# OR
cp env-template.txt .env.local          # Mac/Linux

# Edit .env.local and add your credentials:
# - DATABASE_URL: Your Supabase connection string
# - OPENAI_API_KEY: Your OpenAI API key
```

**Where to get credentials:**
- **Supabase URL**: Dashboard → Settings → Database → Connection String (URI)
- **OpenAI Key**: platform.openai.com → API Keys → Create new key

### 2. Database Setup (1 minute)
```bash
npm run db:migrate
```
When prompted, name it "init" and press Enter.

### 3. Start the App (30 seconds)
```bash
npm run dev
```

### 4. Open Browser (30 seconds)
Navigate to: **http://localhost:3000/resume-parser**

### 5. Test It! (1 minute)
1. Drag and drop a resume file (PDF, DOCX, or TXT)
2. Wait 5-10 seconds for AI extraction
3. Edit the extracted fields
4. Click "Save Changes"
5. See it appear in the "Saved Resumes" section

## ✅ That's It!

You're now running a full-stack AI resume parser with:
- OpenAI GPT-4 extraction
- Supabase database storage
- Modern React UI
- Complete CRUD operations

## 📖 Need More Info?

- **Detailed setup**: See `SETUP_GUIDE.md`
- **Technical docs**: See `RESUME_PARSER_README.md`
- **What was built**: See `IMPLEMENTATION_SUMMARY.md`

## ❓ Common Issues

**"OpenAI API key not configured"**
→ Check your `.env.local` file has `OPENAI_API_KEY` set

**"Failed to connect to database"**
→ Verify your `DATABASE_URL` in `.env.local`
→ Run `npm run db:push` to sync schema

**"Prisma Client not found"**
→ Run `npm run db:generate`

## 🎯 File Organization

```
Backend (API):     app/api/upload, app/api/extract, app/api/resumes
Frontend (UI):     app/resume-parser/page.tsx and components/
Database Schema:   prisma/schema.prisma
```

Every file is clearly marked with `// BACKEND:` or `// FRONTEND:` comments.

---

**Happy parsing!** 🎉

