CREATE TYPE "public"."color" AS ENUM('w', 'b');--> statement-breakpoint
CREATE TYPE "public"."piece" AS ENUM('q', 'r', 'n', 'b', 'k');--> statement-breakpoint
CREATE TYPE "public"."promotion_piece" AS ENUM('q', 'r', 'n', 'b');--> statement-breakpoint
ALTER TABLE "games" RENAME COLUMN "gameOverReason" TO "gameover_reason";--> statement-breakpoint
ALTER TABLE "moves" RENAME COLUMN "fen" TO "fen_after";--> statement-breakpoint
ALTER TABLE "moves" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "current_fen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "current_turn" "color" NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "white_time_left" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "black_time_left" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "last_move_at" timestamp;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "from" varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "to" varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "promotion" "promotion_piece";--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "player_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "player_color" "color" NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "piece" "piece" NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "is_capture" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "is_check" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "is_checkmate" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "move_time" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "moves" ADD COLUMN "san" varchar(10) NOT NULL;