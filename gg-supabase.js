/**
 * gg-supabase.js — Graham Games Cloud Save System
 *
 * Shared script for all Graham Games pages. Provides:
 *   - Supabase client initialization
 *   - Gamer name auth (sign up / login / logout)
 *   - Cloud-synced ggLoad / ggSave / ggUnlockAchievement
 *   - localStorage monkey-patch for game-specific save sync
 *   - Achievement toast system
 *
 * Usage: Include AFTER the Supabase CDN script in every HTML file:
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="/gg-supabase.js"></script>
 *
 * Then replace local ggLoad/ggSave/ggUnlockAchievement with the ones from this file.
 */

// ═══ CONFIG ═══
// Replace these after creating your Supabase project
const GG_SUPABASE_URL = 'https://ibfjkctnklcgyfmjjivv.supabase.co';
const GG_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZmprY3Rua2xjZ3lmbWpqaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTM0MjYsImV4cCI6MjA5MDM4OTQyNn0.ZSaIOTJ_io3BJ0ra8r0g8EaQ_zFLD-K9fFVDhR9SRJQ';

const GG_KEY = 'graham-games-data';
const GG_AUTH_KEY = 'gg-auth-session'; // local cache of gamer name

// ═══ SUPABASE CLIENT ═══
let _supabase = null;
function getSupabase() {
  if (!_supabase && typeof supabase !== 'undefined' && GG_SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    _supabase = supabase.createClient(GG_SUPABASE_URL, GG_SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ═══ GAMER NAME GENERATOR ═══
const GG_ADJ = [
  'fried','crispy','sneaky','fluffy','dizzy','chunky','spicy','wobbly','turbo','mega',
  'cosmic','crunchy','fancy','grumpy','jolly','lucky','mighty','peppy','royal','salty',
  'swift','tiny','wacky','zesty','brave','clever','daring','epic','funky','golden',
  'happy','icy','jazzy','keen','loud','mystic','noble','odd','plucky','quick',
  'rowdy','shiny','toasty','ultra','vivid','wild','xerox','yappy','zippy','ace',
];
const GG_NOUN = [
  'potato','nugget','pickle','waffle','noodle','muffin','taco','pretzel','biscuit','donut',
  'pancake','burrito','cookie','cupcake','dumpling','falafel','gummy','hotdog','icecream','jellybean',
  'kebab','lemon','macaron','nacho','olive','pizza','quiche','ramen','sushi','toast',
  'udon','vanilla','wasabi','yam','ziti','bagel','churro','eclair','fig','grape',
  'hazel','ivy','jam','kiwi','lime','mango','nectar','oat','peach','plum',
];

function generateGamerName() {
  const adj = GG_ADJ[Math.floor(Math.random() * GG_ADJ.length)];
  const noun = GG_NOUN[Math.floor(Math.random() * GG_NOUN.length)];
  const num = String(Math.floor(Math.random() * 900000) + 100000);
  return adj + ' ' + noun + num;
}

// ═══ AUTH ═══
let _ggUser = null;       // { id, gamerName }
let _ggAuthReady = false;

// Internal: fake email from gamer name
function _nameToEmail(name) {
  return name.toLowerCase().replace(/\s+/g, '_') + '@gg.internal';
}

async function ggSignUp(gamerName, password) {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase not configured' };

  const lowerName = gamerName.toLowerCase();
  const email = _nameToEmail(gamerName);

  // Check if name is taken
  const { data: existing } = await sb.from('usernames').select('gamer_name').eq('gamer_name', lowerName).single();
  if (existing) return { error: 'That gamer name is already taken!' };

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await sb.auth.signUp({
    email,
    password,
    options: { data: { gamer_name: gamerName } }
  });
  if (authError) return { error: authError.message };

  const userId = authData.user.id;

  // Insert username record
  await sb.from('usernames').insert({ gamer_name: lowerName, display_name: gamerName, user_id: userId });

  // Initialize user_data with current localStorage G Bux data
  const localData = ggLoad();
  await sb.from('user_data').insert({
    user_id: userId,
    gamer_name: gamerName,
    g_bux: localData.gBux || 0,
    achievements: localData.achievements || {},
    shop_purchases: localData.shopPurchases || {},
  });

  _ggUser = { id: userId, gamerName };
  _ggAuthReady = true;
  localStorage.setItem(GG_AUTH_KEY, JSON.stringify({ gamerName }));

  // Upload existing game saves
  _uploadAllLocalSaves(userId);

  return { user: _ggUser };
}

async function ggLogin(gamerName, password) {
  const sb = getSupabase();
  if (!sb) return { error: 'Supabase not configured' };

  const lowerName = gamerName.toLowerCase();

  // Look up the actual email from the username
  const { data: nameRow } = await sb.from('usernames').select('display_name').eq('gamer_name', lowerName).single();
  if (!nameRow) return { error: 'Gamer name not found!' };

  const email = _nameToEmail(nameRow.display_name);
  const { data: authData, error: authError } = await sb.auth.signInWithPassword({ email, password });
  if (authError) return { error: 'Wrong password!' };

  const userId = authData.user.id;
  _ggUser = { id: userId, gamerName: nameRow.display_name };
  _ggAuthReady = true;
  localStorage.setItem(GG_AUTH_KEY, JSON.stringify({ gamerName: nameRow.display_name }));

  // Pull cloud data → localStorage (cloud is authoritative)
  await _pullCloudData(userId);

  return { user: _ggUser };
}

async function ggLogout() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  _ggUser = null;
  _ggAuthReady = false;
  localStorage.removeItem(GG_AUTH_KEY);
}

function ggGetUser() { return _ggUser; }
function ggIsLoggedIn() { return !!_ggUser; }

// Restore session on page load
async function _ggRestoreSession() {
  const sb = getSupabase();
  if (!sb) return;
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    const userId = session.user.id;
    const cached = JSON.parse(localStorage.getItem(GG_AUTH_KEY) || 'null');
    const gamerName = cached?.gamerName || session.user.user_metadata?.gamer_name || 'Unknown';
    _ggUser = { id: userId, gamerName };
    _ggAuthReady = true;
    // Quietly sync cloud → local
    _pullCloudData(userId);
  }
}

// ═══ G BUX LOAD / SAVE (localStorage first, async cloud sync) ═══

function ggLoad() {
  try {
    return JSON.parse(localStorage.getItem(GG_KEY)) || { gBux: 0, achievements: {}, shopPurchases: {} };
  } catch (e) {
    return { gBux: 0, achievements: {}, shopPurchases: {} };
  }
}

function ggSave(data) {
  localStorage.setItem(GG_KEY, JSON.stringify(data));
  // Async cloud sync (fire and forget)
  if (_ggUser) {
    const sb = getSupabase();
    if (sb) {
      sb.from('user_data').update({
        g_bux: data.gBux || 0,
        achievements: data.achievements || {},
        shop_purchases: data.shopPurchases || {},
        updated_at: new Date().toISOString(),
      }).eq('user_id', _ggUser.id).then(() => {});
    }
  }
}

function ggUnlockAchievement(id, name, reward) {
  const data = ggLoad();
  if (data.achievements[id]) return false;
  data.achievements[id] = true;
  data.gBux += reward;
  ggSave(data);
  showAchievementToast(name, reward);
  return true;
}

// ═══ ACHIEVEMENT TOAST ═══
let ggToastQueue = [], ggToastShowing = false;

function showAchievementToast(name, reward) {
  ggToastQueue.push({ name, reward });
  if (!ggToastShowing) processToastQueue();
}

function processToastQueue() {
  if (!ggToastQueue.length) { ggToastShowing = false; return; }
  ggToastShowing = true;
  const { name, reward } = ggToastQueue.shift();
  const toastName = document.getElementById('gg-toast-name');
  const toastReward = document.getElementById('gg-toast-reward');
  const toast = document.getElementById('gg-toast');
  if (toastName) toastName.textContent = name;
  if (toastReward) toastReward.textContent = '+' + reward + ' G Bux';
  if (toast) toast.classList.add('visible');
  setTimeout(() => {
    if (toast) toast.classList.remove('visible');
    setTimeout(processToastQueue, 400);
  }, 3000);
}

// ═══ CLOUD DATA SYNC ═══

async function _pullCloudData(userId) {
  const sb = getSupabase();
  if (!sb) return;

  // Pull G Bux data (cloud is authoritative on login)
  const { data: userData } = await sb.from('user_data').select('*').eq('user_id', userId).single();
  if (userData) {
    const merged = {
      gBux: userData.g_bux,
      achievements: userData.achievements || {},
      shopPurchases: userData.shop_purchases || {},
    };
    localStorage.setItem(GG_KEY, JSON.stringify(merged));
  }

  // Pull game saves
  const { data: saves } = await sb.from('game_saves').select('save_key, data').eq('user_id', userId);
  if (saves) {
    for (const s of saves) {
      localStorage.setItem(s.save_key, s.data);
    }
  }
}

async function _uploadAllLocalSaves(userId) {
  const sb = getSupabase();
  if (!sb) return;

  const keysToSync = [
    'minilife-slots', 'minilife-slot-0', 'minilife-slot-1', 'minilife-slot-2',
    'school-nurse-save', 'school-nurse-progress', 'school-nurse-student-save', 'school-nurse-student-progress',
    'aw-stats', 'aw-campaign-progress', 'aw-campaign-save', 'aw-sandbox-battles', 'aw-blood',
    'bm-stats', 'bm-collection', 'bm-tutorial-done', 'bm-trainer', 'bm-freeplay-save', 'bm-freeplay-checkpoints',
    'bb-stats', 'td-map-progress', 'dd-stats', 'hurgvibbit-leaderboard',
    'sb-stats', 'sb-player', 'dtd-stats', 'mio-save', 'mio-game-save', 'rd-save',
  ];

  const rows = [];
  for (const key of keysToSync) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      rows.push({ user_id: userId, save_key: key, data: val });
    }
  }
  if (rows.length > 0) {
    await sb.from('game_saves').upsert(rows, { onConflict: 'user_id,save_key' });
  }
}

// ═══ LOCALSTORAGE MONKEY-PATCH (auto-sync game saves) ═══

const _SYNC_KEYS = new Set([
  'minilife-slots', 'minilife-slot-0', 'minilife-slot-1', 'minilife-slot-2',
  'school-nurse-save', 'school-nurse-progress', 'school-nurse-student-save', 'school-nurse-student-progress',
  'aw-stats', 'aw-campaign-progress', 'aw-campaign-save', 'aw-sandbox-battles', 'aw-blood',
  'bm-stats', 'bm-collection', 'bm-tutorial-done', 'bm-trainer', 'bm-freeplay-save', 'bm-freeplay-checkpoints',
  'bb-stats', 'td-map-progress', 'dd-stats', 'hurgvibbit-leaderboard',
  'sb-stats', 'sb-player', 'dtd-stats', 'mio-save', 'mio-game-save', 'rd-save',
]);

const _origSetItem = localStorage.setItem.bind(localStorage);
const _origRemoveItem = localStorage.removeItem.bind(localStorage);

localStorage.setItem = function(key, value) {
  _origSetItem(key, value);
  // Async sync to cloud if logged in and it's a known game key
  if (_ggUser && _SYNC_KEYS.has(key)) {
    const sb = getSupabase();
    if (sb) {
      sb.from('game_saves').upsert(
        { user_id: _ggUser.id, save_key: key, data: value, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,save_key' }
      ).then(() => {});
    }
  }
  // Also sync GG_KEY changes
  if (_ggUser && key === GG_KEY) {
    try {
      const d = JSON.parse(value);
      const sb = getSupabase();
      if (sb) {
        sb.from('user_data').update({
          g_bux: d.gBux || 0,
          achievements: d.achievements || {},
          shop_purchases: d.shopPurchases || {},
          updated_at: new Date().toISOString(),
        }).eq('user_id', _ggUser.id).then(() => {});
      }
    } catch (e) {}
  }
};

localStorage.removeItem = function(key) {
  _origRemoveItem(key);
  if (_ggUser && _SYNC_KEYS.has(key)) {
    const sb = getSupabase();
    if (sb) {
      sb.from('game_saves').delete().eq('user_id', _ggUser.id).eq('save_key', key).then(() => {});
    }
  }
};

// ═══ INIT ═══
// Auto-restore session when script loads
if (typeof window !== 'undefined') {
  // Defer to let Supabase CDN script load
  setTimeout(() => _ggRestoreSession(), 0);
}
