CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(32) NOT NULL,
	"car_model" varchar(120),
	"message" text,
	"source" varchar(60) DEFAULT 'website' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"car_model" varchar(120) NOT NULL,
	"position" varchar(80) NOT NULL,
	"material" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"price_from" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
