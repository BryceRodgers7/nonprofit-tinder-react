-- AlterTable
ALTER TABLE "app_users" ADD COLUMN     "userTypeId" INTEGER;

-- CreateTable
CREATE TABLE "user_type" (
    "id" SERIAL NOT NULL,
    "userTypeTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "primary_cause_areas" (
    "id" SERIAL NOT NULL,
    "causeAreaTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "primary_cause_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "populations" (
    "id" SERIAL NOT NULL,
    "populationTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "populations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geographic_focus" (
    "id" SERIAL NOT NULL,
    "geographicTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geographic_focus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_style" (
    "id" SERIAL NOT NULL,
    "donationStyleTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profile_cause_area" (
    "id" TEXT NOT NULL,
    "donorProfileId" TEXT NOT NULL,
    "causeAreaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donor_profile_cause_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profile_population" (
    "id" TEXT NOT NULL,
    "donorProfileId" TEXT NOT NULL,
    "populationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donor_profile_population_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profile_geographic_focus" (
    "id" TEXT NOT NULL,
    "donorProfileId" TEXT NOT NULL,
    "geographicFocusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donor_profile_geographic_focus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profile_donation_style" (
    "id" TEXT NOT NULL,
    "donorProfileId" TEXT NOT NULL,
    "donationStyleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donor_profile_donation_style_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_type_userTypeTitle_key" ON "user_type"("userTypeTitle");

-- CreateIndex
CREATE UNIQUE INDEX "primary_cause_areas_causeAreaTitle_key" ON "primary_cause_areas"("causeAreaTitle");

-- CreateIndex
CREATE UNIQUE INDEX "populations_populationTitle_key" ON "populations"("populationTitle");

-- CreateIndex
CREATE UNIQUE INDEX "geographic_focus_geographicTitle_key" ON "geographic_focus"("geographicTitle");

-- CreateIndex
CREATE UNIQUE INDEX "donation_style_donationStyleTitle_key" ON "donation_style"("donationStyleTitle");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profile_userId_key" ON "donor_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profile_cause_area_donorProfileId_causeAreaId_key" ON "donor_profile_cause_area"("donorProfileId", "causeAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profile_population_donorProfileId_populationId_key" ON "donor_profile_population"("donorProfileId", "populationId");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profile_geographic_focus_donorProfileId_geographicFoc_key" ON "donor_profile_geographic_focus"("donorProfileId", "geographicFocusId");

-- CreateIndex
CREATE UNIQUE INDEX "donor_profile_donation_style_donorProfileId_donationStyleId_key" ON "donor_profile_donation_style"("donorProfileId", "donationStyleId");

-- AddForeignKey
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile" ADD CONSTRAINT "donor_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_cause_area" ADD CONSTRAINT "donor_profile_cause_area_donorProfileId_fkey" FOREIGN KEY ("donorProfileId") REFERENCES "donor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_cause_area" ADD CONSTRAINT "donor_profile_cause_area_causeAreaId_fkey" FOREIGN KEY ("causeAreaId") REFERENCES "primary_cause_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_population" ADD CONSTRAINT "donor_profile_population_donorProfileId_fkey" FOREIGN KEY ("donorProfileId") REFERENCES "donor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_population" ADD CONSTRAINT "donor_profile_population_populationId_fkey" FOREIGN KEY ("populationId") REFERENCES "populations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_geographic_focus" ADD CONSTRAINT "donor_profile_geographic_focus_donorProfileId_fkey" FOREIGN KEY ("donorProfileId") REFERENCES "donor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_geographic_focus" ADD CONSTRAINT "donor_profile_geographic_focus_geographicFocusId_fkey" FOREIGN KEY ("geographicFocusId") REFERENCES "geographic_focus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_donation_style" ADD CONSTRAINT "donor_profile_donation_style_donorProfileId_fkey" FOREIGN KEY ("donorProfileId") REFERENCES "donor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donor_profile_donation_style" ADD CONSTRAINT "donor_profile_donation_style_donationStyleId_fkey" FOREIGN KEY ("donationStyleId") REFERENCES "donation_style"("id") ON DELETE CASCADE ON UPDATE CASCADE;
