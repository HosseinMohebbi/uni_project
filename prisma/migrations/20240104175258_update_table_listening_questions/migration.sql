/*
  Warnings:

  - You are about to drop the column `audio_id` on the `listening_answers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[question_id,user_id]` on the table `listening_answers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question_id` to the `listening_answers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "listening_answers" DROP CONSTRAINT "listening_answers_audio_id_fkey";

-- DropIndex
DROP INDEX "listening_answers_audio_id_user_id_key";

-- AlterTable
ALTER TABLE "listening_answers" DROP COLUMN "audio_id",
ADD COLUMN     "question_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "listening_answers_question_id_user_id_key" ON "listening_answers"("question_id", "user_id");

-- AddForeignKey
ALTER TABLE "listening_answers" ADD CONSTRAINT "listening_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "listening_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
