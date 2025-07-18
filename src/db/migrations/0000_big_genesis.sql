CREATE TYPE "public"."result" AS ENUM('draw', 'white_won', 'black_won');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('not-started', 'playing', 'finished');--> statement-breakpoint
CREATE TYPE "public"."timer_options" AS ENUM('bullet 1+0', 'bullet 2+1', 'blitz 3+0', 'blitz 3+2', 'blitz 5+0', 'blitz 5+3', 'rapid 10+0', 'rapid 10+5', 'rapid 15+10');--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"white_id" uuid,
	"black_id" uuid,
	"for_guests" boolean NOT NULL,
	"result" "result",
	"status" "status" DEFAULT 'not-started' NOT NULL,
	"timer" timer_options NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moves" (
	"id" uuid PRIMARY KEY NOT NULL,
	"move_number" integer NOT NULL,
	"gameId" uuid,
	"fen" varchar(100),
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
ALTER TABLE "moves" ADD CONSTRAINT "moves_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;