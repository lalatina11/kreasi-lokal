-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "verification_identifier_not_null" CHECK (NOT NULL identifier),
	CONSTRAINT "verification_value_not_null" CHECK (NOT NULL value),
	CONSTRAINT "verification_expires_at_not_null" CHECK (NOT NULL expires_at),
	CONSTRAINT "verification_created_at_not_null" CHECK (NOT NULL created_at),
	CONSTRAINT "verification_updated_at_not_null" CHECK (NOT NULL updated_at)
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text,
	"display_username" text,
	"bio" text,
	"avatar" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "user_name_not_null" CHECK (NOT NULL name),
	CONSTRAINT "user_email_not_null" CHECK (NOT NULL email),
	CONSTRAINT "user_email_verified_not_null" CHECK (NOT NULL email_verified),
	CONSTRAINT "user_created_at_not_null" CHECK (NOT NULL created_at),
	CONSTRAINT "user_updated_at_not_null" CHECK (NOT NULL updated_at)
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "account_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "account_account_id_not_null" CHECK (NOT NULL account_id),
	CONSTRAINT "account_provider_id_not_null" CHECK (NOT NULL provider_id),
	CONSTRAINT "account_user_id_not_null" CHECK (NOT NULL user_id),
	CONSTRAINT "account_created_at_not_null" CHECK (NOT NULL created_at),
	CONSTRAINT "account_updated_at_not_null" CHECK (NOT NULL updated_at)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token"),
	CONSTRAINT "session_id_not_null" CHECK (NOT NULL id),
	CONSTRAINT "session_expires_at_not_null" CHECK (NOT NULL expires_at),
	CONSTRAINT "session_token_not_null" CHECK (NOT NULL token),
	CONSTRAINT "session_created_at_not_null" CHECK (NOT NULL created_at),
	CONSTRAINT "session_updated_at_not_null" CHECK (NOT NULL updated_at),
	CONSTRAINT "session_user_id_not_null" CHECK (NOT NULL user_id)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
*/