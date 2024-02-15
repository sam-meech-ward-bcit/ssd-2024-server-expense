CREATE TABLE IF NOT EXISTS "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
