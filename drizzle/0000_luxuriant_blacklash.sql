CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."enquiry_status" AS ENUM('pending', 'confirmed', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."gallery_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"image_url" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"enquiry_id" integer,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"date" timestamp,
	"time_slot" varchar(50),
	"service" varchar(255),
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"price" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"preferred_date" timestamp,
	"message" text,
	"status" "enquiry_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "gallery_type" DEFAULT 'image' NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer,
	"customer_name" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"amount" varchar(50) NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"due_date" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" varchar(50),
	"duration" varchar(50),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_key" varchar(255) NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "site_content_section_key_unique" UNIQUE("section_key")
);
