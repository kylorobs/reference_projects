/*
  Warnings:

  - You are about to drop the column `company` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "company";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" BOOLEAN NOT NULL DEFAULT false;
