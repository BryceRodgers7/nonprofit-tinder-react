/*
  Warnings:

  - You are about to drop the `resumes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "resumes";

-- CreateTable
CREATE TABLE "app_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT,
    "s3Key" TEXT,
    "s3Url" TEXT,
    "organizationName" TEXT,
    "ein" TEXT,
    "missionStatement" TEXT,
    "yearFounded" TEXT,
    "locationServed" TEXT,
    "biggestAccomplishment" TEXT,
    "oneSentenceSummary" TEXT,
    "legalDesignation" TEXT,
    "primaryCauseAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "populations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "geographicalFocus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
