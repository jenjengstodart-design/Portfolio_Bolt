/*
  # Add Missing Chat Conversation Columns

  ## Overview
  Adds missing columns to chat_conversations table that were defined in the schema but not applied to the database.

  ## Changes
  - Added `started_at` column for conversation start timestamp
  - Added `last_message_at` column for most recent activity tracking
  - Added `message_count` column for conversation message count
  - Added `user_email` column for optional user email storage
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'started_at'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN started_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN last_message_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'message_count'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN message_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_conversations' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE chat_conversations ADD COLUMN user_email text;
  END IF;
END $$;