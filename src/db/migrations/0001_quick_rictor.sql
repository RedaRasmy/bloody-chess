ALTER TYPE "public"."timer_options" RENAME TO "timer_option";--> statement-breakpoint
ALTER TABLE "moves" RENAME COLUMN "gameId" TO "game_id";--> statement-breakpoint
ALTER TABLE "moves" DROP CONSTRAINT "moves_gameId_games_id_fk";
--> statement-breakpoint
ALTER TABLE "moves" ADD CONSTRAINT "moves_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;