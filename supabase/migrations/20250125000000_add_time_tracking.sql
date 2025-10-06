-- Migration: Add time tracking tables
-- This migration adds tables for time entries and daily notes to support the accountability time tracker

-- Create TimeEntryStatus enum type
CREATE TYPE "public"."time_entry_status" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED');

-- Create time_entries table
CREATE TABLE "public"."time_entries" (
    "id" text NOT NULL,
    "user_id" text NOT NULL,
    "start_time" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "end_time" timestamp with time zone,
    "status" time_entry_status NOT NULL DEFAULT 'ACTIVE',
    "description" text,
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create daily_notes table
CREATE TABLE "public"."daily_notes" (
    "id" text NOT NULL,
    "user_id" text NOT NULL,
    "content" text NOT NULL,
    "date" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "created_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    "updated_at" timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE UNIQUE INDEX "time_entries_pkey" ON "public"."time_entries" USING btree (id);
CREATE INDEX "time_entries_user_id_idx" ON "public"."time_entries" USING btree (user_id);
CREATE INDEX "time_entries_status_idx" ON "public"."time_entries" USING btree (status);
CREATE INDEX "time_entries_start_time_idx" ON "public"."time_entries" USING btree (start_time);

CREATE UNIQUE INDEX "daily_notes_pkey" ON "public"."daily_notes" USING btree (id);
CREATE INDEX "daily_notes_user_id_idx" ON "public"."daily_notes" USING btree (user_id);
CREATE UNIQUE INDEX "daily_notes_user_id_date_key" ON "public"."daily_notes" USING btree (user_id, date);

-- Add primary key constraints
ALTER TABLE "public"."time_entries" ADD CONSTRAINT "time_entries_pkey" PRIMARY KEY USING INDEX "time_entries_pkey";
ALTER TABLE "public"."daily_notes" ADD CONSTRAINT "daily_notes_pkey" PRIMARY KEY USING INDEX "daily_notes_pkey";

-- Add unique constraint for daily_notes
ALTER TABLE "public"."daily_notes" ADD CONSTRAINT "daily_notes_user_id_date_key" UNIQUE USING INDEX "daily_notes_user_id_date_key";

-- Enable RLS
ALTER TABLE "public"."time_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."daily_notes" ENABLE ROW LEVEL SECURITY;

-- Create policies for time_entries
CREATE POLICY "Users can view their own time entries" ON "public"."time_entries"
    FOR SELECT USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own time entries" ON "public"."time_entries"
    FOR INSERT WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own time entries" ON "public"."time_entries"
    FOR UPDATE USING (requesting_user_id() = user_id);

CREATE POLICY "Users can delete their own time entries" ON "public"."time_entries"
    FOR DELETE USING (requesting_user_id() = user_id);

-- Create policies for daily_notes
CREATE POLICY "Users can view their own daily notes" ON "public"."daily_notes"
    FOR SELECT USING (requesting_user_id() = user_id);

CREATE POLICY "Users can insert their own daily notes" ON "public"."daily_notes"
    FOR INSERT WITH CHECK (requesting_user_id() = user_id);

CREATE POLICY "Users can update their own daily notes" ON "public"."daily_notes"
    FOR UPDATE USING (requesting_user_id() = user_id);

CREATE POLICY "Users can delete their own daily notes" ON "public"."daily_notes"
    FOR DELETE USING (requesting_user_id() = user_id);

-- Grant permissions
GRANT ALL ON "public"."time_entries" TO "authenticated";
GRANT ALL ON "public"."daily_notes" TO "authenticated";

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER "handle_time_entries_updated_at" 
    BEFORE UPDATE ON "public"."time_entries" 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER "handle_daily_notes_updated_at" 
    BEFORE UPDATE ON "public"."daily_notes" 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();