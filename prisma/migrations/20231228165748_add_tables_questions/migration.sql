-- CreateTable
CREATE TABLE "listening_questions" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "audio_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listening_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_answers" (
    "answer" TEXT NOT NULL,
    "audio_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "speaking_questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speaking_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_answers" (
    "description" TEXT,
    "answer_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "listening_questions_id_key" ON "listening_questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "listening_answers_audio_id_user_id_key" ON "listening_answers"("audio_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_questions_id_key" ON "speaking_questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_answers_user_id_key" ON "speaking_answers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "speaking_answers_question_id_user_id_answer_id_key" ON "speaking_answers"("question_id", "user_id", "answer_id");

-- AddForeignKey
ALTER TABLE "listening_questions" ADD CONSTRAINT "listening_questions_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_answers" ADD CONSTRAINT "listening_answers_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "listening_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listening_answers" ADD CONSTRAINT "listening_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_answers" ADD CONSTRAINT "speaking_answers_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_answers" ADD CONSTRAINT "speaking_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "speaking_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_answers" ADD CONSTRAINT "speaking_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
