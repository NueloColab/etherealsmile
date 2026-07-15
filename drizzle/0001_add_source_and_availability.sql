ALTER TABLE "bookings" ADD COLUMN "source" varchar(50) DEFAULT 'website' NOT NULL;--> statement-breakpoint
CREATE TABLE "availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"time_slot" varchar(50),
	"reason" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
