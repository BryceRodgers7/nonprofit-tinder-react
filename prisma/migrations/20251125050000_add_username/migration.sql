-- AlterTable
ALTER TABLE "app_users" ADD COLUMN "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "app_users_username_key" ON "app_users"("username");

