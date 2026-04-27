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

-- ═══ PUBLIC PLAY COUNTS ═══
CREATE TABLE play_counts (
  game_href TEXT PRIMARY KEY,              -- e.g. 'mini-life/game.html'
  total_plays INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anyone can read, anyone can upsert (no auth required for play tracking)
ALTER TABLE play_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read play counts" ON play_counts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert play counts" ON play_counts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update play counts" ON play_counts FOR UPDATE USING (true);

-- RPC function to atomically increment a game's play count
CREATE OR REPLACE FUNCTION increment_play_count(game TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO play_counts (game_href, total_plays)
  VALUES (game, 1)
  ON CONFLICT (game_href)
  DO UPDATE SET total_plays = play_counts.total_plays + 1, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══ GRAHAM-ONLY PLANNER ═══
-- Shared launcher reminders/notes. Access is intentionally app-gated by the
-- launcher code so the same plan is available from all Graham devices.
CREATE TABLE graham_notes (
  id TEXT PRIMARY KEY,
  data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE graham_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read Graham notes" ON graham_notes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert Graham notes" ON graham_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update Graham notes" ON graham_notes FOR UPDATE USING (true);
