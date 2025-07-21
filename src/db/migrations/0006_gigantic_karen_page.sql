ALTER TYPE "public"."piece" ADD VALUE 'p';--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "game_start_at" timestamp;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "captured_piece" "piece";--> statement-breakpoint
ALTER TABLE "moves" DROP COLUMN "move_number";--> statement-breakpoint
ALTER TABLE "moves" DROP COLUMN "player_id";--> statement-breakpoint
ALTER TABLE "moves" DROP COLUMN "is_capture";