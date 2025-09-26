/*
  Warnings:

  - The `tags` column on the `Dataset` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `filename` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Dataset" ADD COLUMN     "filename" TEXT NOT NULL,
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[];
