ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'matching'::text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('matching', 'preparing', 'playing', 'finished');--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DEFAULT 'matching'::"public"."status";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "white_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "current_turn" SET DEFAULT 'w';--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "white_ready" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "black_ready" boolean DEFAULT false NOT NULL;