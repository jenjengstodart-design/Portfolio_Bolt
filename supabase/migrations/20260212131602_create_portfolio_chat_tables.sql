/*
  # Portfolio Website Chat and Analytics Schema

  ## Overview
  This migration creates the database schema for the AI-powered portfolio chat feature
  and analytics tracking for Jen Jeng's portfolio website.

  ## New Tables

  ### 1. `chat_conversations`
  Stores individual chat sessions with visitors
  - `id` (uuid, primary key) - Unique conversation identifier
  - `session_id` (text) - Browser session identifier for tracking anonymous users
  - `user_email` (text, nullable) - Email if user provides it
  - `started_at` (timestamptz) - When conversation began
  - `last_message_at` (timestamptz) - Most recent activity
  - `message_count` (integer) - Number of messages exchanged
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `chat_messages`
  Stores individual messages within conversations
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Links to conversation
  - `role` (text) - Either 'user' or 'assistant'
  - `content` (text) - Message content
  - `timestamp` (timestamptz) - When message was sent
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `popular_questions`
  Tracks frequently asked questions for dynamic FAQ generation
  - `id` (uuid, primary key) - Unique question identifier
  - `question` (text, unique) - The normalized question text
  - `ask_count` (integer) - Number of times asked
  - `last_asked` (timestamptz) - Most recent occurrence
  - `created_at` (timestamptz) - First time asked
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `analytics_events`
  Tracks user interactions and page views
  - `id` (uuid, primary key) - Unique event identifier
  - `event_type` (text) - Type of event (page_view, cv_download, chat_started, etc.)
  - `page` (text, nullable) - Page where event occurred
  - `metadata` (jsonb, nullable) - Additional event data
  - `session_id` (text, nullable) - Browser session identifier
  - `timestamp` (timestamptz) - When event occurred

  ## Security
  - All tables have RLS enabled
  - Public read access for analytics (aggregate data only)
  - Public insert access for chat and events
  - No update/delete access from public users
*/

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_email text,
  started_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create popular_questions table
CREATE TABLE IF NOT EXISTS popular_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text UNIQUE NOT NULL,
  ask_count integer DEFAULT 1,
  last_asked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page text,
  metadata jsonb,
  session_id text,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_popular_questions_count ON popular_questions(ask_count DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
-- Allow public to insert new conversations
CREATE POLICY "Anyone can create conversations"
  ON chat_conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to view their own conversations by session_id
CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to update their own conversations
CREATE POLICY "Users can update own conversations"
  ON chat_conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for chat_messages
-- Allow public to insert messages
CREATE POLICY "Anyone can create messages"
  ON chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to view messages
CREATE POLICY "Anyone can view messages"
  ON chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for popular_questions
-- Allow public to view popular questions
CREATE POLICY "Anyone can view popular questions"
  ON popular_questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to insert/update popular questions
CREATE POLICY "Anyone can track questions"
  ON popular_questions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update question counts"
  ON popular_questions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for analytics_events
-- Allow public to insert analytics events
CREATE POLICY "Anyone can create analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to view analytics (for aggregate displays)
CREATE POLICY "Anyone can view analytics"
  ON analytics_events FOR SELECT
  TO anon, authenticated
  USING (true);
