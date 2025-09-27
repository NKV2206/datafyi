/*
  Warnings:

  - You are about to drop the column `userId` on the `Dataset` table. All the data in the column will be lost.
  - Added the required column `userAddress` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Dataset" DROP CONSTRAINT "Dataset_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Dataset" DROP COLUMN "userId",
ADD COLUMN     "userAddress" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Dataset" ADD CONSTRAINT "Dataset_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "public"."User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
