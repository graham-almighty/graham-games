-- Graham Games — Supabase Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ═══ GAMER NAME LOOKUP ═══
CREATE TABLE usernames (
  gamer_name TEXT PRIMARY KEY,            -- lowercased, unique
  display_name TEXT NOT NULL,             -- original casing for display
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user_id lookups
CREATE INDEX idx_usernames_user_id ON usernames(user_id);

-- RLS: anyone can read (for login lookup), authenticated users can insert their own
ALTER TABLE usernames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read usernames" ON usernames FOR SELECT USING (true);
CREATE POLICY "Users can insert own username" ON usernames FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══ SHARED G BUX DATA ═══
CREATE TABLE user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  gamer_name TEXT NOT NULL,
  g_bux INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '{}',
  shop_purchases JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: users can only access their own data
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON user_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own data" ON user_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own data" ON user_data FOR UPDATE USING (auth.uid() = user_id);

-- ═══ GAME-SPECIFIC SAVES ═══
CREATE TABLE game_saves (
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  save_key TEXT NOT NULL,                 -- e.g. 'minilife-slot-0', 'aw-stats'
  data TEXT NOT NULL,                     -- JSON string
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, save_key)
);

-- RLS: users can only access their own saves
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own saves" ON game_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saves" ON game_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saves" ON game_saves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saves" ON game_saves FOR DELETE USING (auth.uid() = user_id);
