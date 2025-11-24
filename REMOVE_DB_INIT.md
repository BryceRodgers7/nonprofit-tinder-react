# How to Remove Temporary Database Initialization Code

This file explains how to remove the temporary database initialization code once your database is properly set up.

## When to Remove This Code

Remove this code **AFTER** you have run the proper database migrations:

```bash
npx prisma migrate dev
```

## Steps to Remove

### 1. Delete the initialization file
Delete: `lib/db-init.ts`

### 2. Remove imports from API routes

In each of these files, **remove the import line** marked with `// TEMPORARY`:

- `app/api/extract/route.ts`
- `app/api/resumes/route.ts`  
- `app/api/resumes/[id]/route.ts`

**Remove this line from each file:**
```typescript
import { ensureDatabaseTables } from '@/lib/db-init'; // TEMPORARY: Remove this line later
```

### 3. Remove function calls from API routes

In each of the same files, **remove the function call** marked with `// TEMPORARY`:

**Remove these lines:**
```typescript
// TEMPORARY: Ensure database tables exist - remove this line later
await ensureDatabaseTables();
```

### 4. Delete this guide
Delete: `REMOVE_DB_INIT.md`

## Quick Find & Replace

Search for these strings in your project to find all temporary code:

- `db-init` - will find all references
- `ensureDatabaseTables` - will find all function calls
- `TEMPORARY` - will find all marked comments

## Verification

After removal, your API routes should start like this:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Your actual code starts here
    const resume = await prisma.resume.findUnique({
```

---

**Note:** This temporary code automatically creates the database tables on first use, but it's not the recommended approach for production. Always use proper migrations (`npx prisma migrate dev`) instead.

