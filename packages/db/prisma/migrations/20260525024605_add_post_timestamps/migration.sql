-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PostTarget" ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;
