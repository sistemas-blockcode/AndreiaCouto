-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "videoData" BYTEA,
ALTER COLUMN "videoUrl" DROP NOT NULL;
