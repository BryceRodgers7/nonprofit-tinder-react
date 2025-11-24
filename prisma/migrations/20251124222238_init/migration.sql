-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "lastJob" TEXT,
    "lastCompany" TEXT,
    "yearsExperience" TEXT,
    "technicalSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "education" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);
