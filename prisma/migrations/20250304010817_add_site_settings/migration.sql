/*
  Warnings:

  - The `status` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `email` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Vente Ivoire',
    "description" TEXT NOT NULL DEFAULT 'Location et vente de véhicules',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@venteivoire.com',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_vehicleId_idx" ON "Reservation"("vehicleId");
