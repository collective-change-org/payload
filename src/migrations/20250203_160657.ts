import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_notification_settings_type" AS ENUM('newsletter', 'event');
  CREATE TYPE "public"."enum_newsletter_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__newsletter_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE IF NOT EXISTS "notification_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_notification_settings_type",
  	"nonce" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter_blocks_h1_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter_blocks_h2_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter_blocks_plain_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "newsletter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_newsletter_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletter_v_blocks_h1_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletter_v_blocks_h2_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletter_v_blocks_plain_rich_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_newsletter_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_subject" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__newsletter_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE jsonb;
  ALTER TABLE "_events_v" ALTER COLUMN "version_description" SET DATA TYPE jsonb;
  ALTER TABLE "events" ADD COLUMN "left" jsonb;
  ALTER TABLE "events" ADD COLUMN "right" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_left" jsonb;
  ALTER TABLE "_events_v" ADD COLUMN "version_right" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "notification_settings_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_id" integer;
  DO $$ BEGIN
   ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_blocks_h1_block" ADD CONSTRAINT "newsletter_blocks_h1_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_blocks_h2_block" ADD CONSTRAINT "newsletter_blocks_h2_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "newsletter_blocks_plain_rich_text_block" ADD CONSTRAINT "newsletter_blocks_plain_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletter_v_blocks_h1_block" ADD CONSTRAINT "_newsletter_v_blocks_h1_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_newsletter_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletter_v_blocks_h2_block" ADD CONSTRAINT "_newsletter_v_blocks_h2_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_newsletter_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletter_v_blocks_plain_rich_text_block" ADD CONSTRAINT "_newsletter_v_blocks_plain_rich_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_newsletter_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_newsletter_v" ADD CONSTRAINT "_newsletter_v_parent_id_newsletter_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."newsletter"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "notification_settings_user_idx" ON "notification_settings" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "notification_settings_updated_at_idx" ON "notification_settings" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "notification_settings_created_at_idx" ON "notification_settings" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h1_block_order_idx" ON "newsletter_blocks_h1_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h1_block_parent_id_idx" ON "newsletter_blocks_h1_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h1_block_path_idx" ON "newsletter_blocks_h1_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h2_block_order_idx" ON "newsletter_blocks_h2_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h2_block_parent_id_idx" ON "newsletter_blocks_h2_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_h2_block_path_idx" ON "newsletter_blocks_h2_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_plain_rich_text_block_order_idx" ON "newsletter_blocks_plain_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_plain_rich_text_block_parent_id_idx" ON "newsletter_blocks_plain_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "newsletter_blocks_plain_rich_text_block_path_idx" ON "newsletter_blocks_plain_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "newsletter_updated_at_idx" ON "newsletter" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "newsletter_created_at_idx" ON "newsletter" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "newsletter__status_idx" ON "newsletter" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h1_block_order_idx" ON "_newsletter_v_blocks_h1_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h1_block_parent_id_idx" ON "_newsletter_v_blocks_h1_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h1_block_path_idx" ON "_newsletter_v_blocks_h1_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h2_block_order_idx" ON "_newsletter_v_blocks_h2_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h2_block_parent_id_idx" ON "_newsletter_v_blocks_h2_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_h2_block_path_idx" ON "_newsletter_v_blocks_h2_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_plain_rich_text_block_order_idx" ON "_newsletter_v_blocks_plain_rich_text_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_plain_rich_text_block_parent_id_idx" ON "_newsletter_v_blocks_plain_rich_text_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_blocks_plain_rich_text_block_path_idx" ON "_newsletter_v_blocks_plain_rich_text_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_parent_idx" ON "_newsletter_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_version_version_updated_at_idx" ON "_newsletter_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_version_version_created_at_idx" ON "_newsletter_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_version_version__status_idx" ON "_newsletter_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_created_at_idx" ON "_newsletter_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_updated_at_idx" ON "_newsletter_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_newsletter_v_latest_idx" ON "_newsletter_v" USING btree ("latest");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notification_settings_fk" FOREIGN KEY ("notification_settings_id") REFERENCES "public"."notification_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_fk" FOREIGN KEY ("newsletter_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_notification_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("notification_settings_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_newsletter_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_id");
  ALTER TABLE "events" DROP COLUMN IF EXISTS "location";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_location";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "notification_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_blocks_h1_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_blocks_h2_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter_blocks_plain_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "newsletter" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_newsletter_v_blocks_h1_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_newsletter_v_blocks_h2_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_newsletter_v_blocks_plain_rich_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_newsletter_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "notification_settings" CASCADE;
  DROP TABLE "newsletter_blocks_h1_block" CASCADE;
  DROP TABLE "newsletter_blocks_h2_block" CASCADE;
  DROP TABLE "newsletter_blocks_plain_rich_text_block" CASCADE;
  DROP TABLE "newsletter" CASCADE;
  DROP TABLE "_newsletter_v_blocks_h1_block" CASCADE;
  DROP TABLE "_newsletter_v_blocks_h2_block" CASCADE;
  DROP TABLE "_newsletter_v_blocks_plain_rich_text_block" CASCADE;
  DROP TABLE "_newsletter_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_notification_settings_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_notification_settings_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_newsletter_id_idx";
  ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE varchar;
  ALTER TABLE "_events_v" ALTER COLUMN "version_description" SET DATA TYPE varchar;
  ALTER TABLE "events" ADD COLUMN "location" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_location" varchar;
  ALTER TABLE "events" DROP COLUMN IF EXISTS "left";
  ALTER TABLE "events" DROP COLUMN IF EXISTS "right";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_left";
  ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_right";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "notification_settings_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "newsletter_id";
  DROP TYPE "public"."enum_notification_settings_type";
  DROP TYPE "public"."enum_newsletter_status";
  DROP TYPE "public"."enum__newsletter_v_version_status";`)
}
