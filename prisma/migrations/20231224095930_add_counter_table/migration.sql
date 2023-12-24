-- CreateTable
CREATE TABLE "user_tags_counter" (
    "tag_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "conter" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_tags_counter_user_id_tag_id_key" ON "user_tags_counter"("user_id", "tag_id");

-- AddForeignKey
ALTER TABLE "user_tags_counter" ADD CONSTRAINT "user_tags_counter_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tags_counter" ADD CONSTRAINT "user_tags_counter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
