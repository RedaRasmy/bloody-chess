CREATE TYPE "public"."gameover_reason" AS ENUM('Checkmate', 'Timeout', 'Fifty moves rule', 'Insufficient material', 'Stalemate', 'Threefold repetition', 'Resignation');--> statement-breakpoint
CREATE TYPE "public"."result" AS ENUM('draw', 'white_won', 'black_won');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('not-started', 'playing', 'finished');--> statement-breakpoint
CREATE TYPE "public"."timer_option" AS ENUM('bullet 1+0', 'bullet 2+1', 'blitz 3+0', 'blitz 3+2', 'blitz 5+0', 'blitz 5+3', 'rapid 10+0', 'rapid 10+5', 'rapid 15+10');--> statement-breakpoint
CREATE TYPE "public"."color" AS ENUM('w', 'b');--> statement-breakpoint
CREATE TYPE "public"."piece" AS ENUM('q', 'r', 'n', 'b', 'k', 'p');--> statement-breakpoint
CREATE TYPE "public"."promotion_piece" AS ENUM('q', 'r', 'n', 'b');--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"white_id" uuid,
	"black_id" uuid,
	"is_for_guests" boolean NOT NULL,
	"current_fen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' NOT NULL,
	"result" "result",
	"gameover_reason" "gameover_reason",
	"status" "status" DEFAULT 'not-started' NOT NULL,
	"timer" timer_option NOT NULL,
	"current_turn" "color" NOT NULL,
	"white_time_left" integer NOT NULL,
	"black_time_left" integer NOT NULL,
	"last_move_at" bigint,
	"game_started_at" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fen_after" text NOT NULL,
	"game_id" uuid NOT NULL,
	"from" varchar(2) NOT NULL,
	"to" varchar(2) NOT NULL,
	"promotion" "promotion_piece",
	"player_color" "color" NOT NULL,
	"piece" "piece" NOT NULL,
	"captured_piece" "piece",
	"is_check" boolean DEFAULT false NOT NULL,
	"is_checkmate" boolean DEFAULT false NOT NULL,
	"move_time" integer NOT NULL,
	"san" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"username" varchar(30) NOT NULL,
	"elo" integer DEFAULT 500 NOT NULL,
	"games_played" integer DEFAULT 0 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "players_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;