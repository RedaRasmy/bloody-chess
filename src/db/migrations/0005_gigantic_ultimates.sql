ALTER TABLE "moves" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ALTER COLUMN "is_capture" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ALTER COLUMN "is_check" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ALTER COLUMN "is_checkmate" SET NOT NULL;