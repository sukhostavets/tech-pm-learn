# Supabase Integration Plan

## Free Tier Fit Assessment ✅

Based on [Supabase Pricing](https://supabase.com/pricing):

| Resource | Free Tier | Our Usage | Status |
|---|---|---|---|
| Database | 500 MB | ~5-10 MB | ✅ ~1% |
| File Storage | 1 GB | Project uploads | ✅ Plenty |
| Auth MAUs | 50,000 | 1-50 users | ✅ Trivial |
| Edge Functions | 500K invocations/mo | Minimal | ✅ Won't touch |
| Real-time | 200 concurrent | ~5 concurrent | ✅ Fine |
| Bandwidth | 5 GB | Text-heavy content | ✅ Fine |

**Verdict**: Comfortably within free tier. Even at 500+ users we'd be fine.

---

## Step-by-Step Integration

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → sign up / sign in
2. Click **New Project**
3. Name: `tech-stable-academy`
4. Set a secure database password (save it somewhere safe)
5. Region: Choose closest (e.g., EU West for Europe)
6. Wait for provisioning (~2 minutes)
7. Go to **Settings → API** and note down:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Publishable key**: `sb_publishable_...` (new format, recommended over legacy anon key)

### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Create Supabase Client Config

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

Create `.env.local` (gitignored):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

> **Note**: Supabase now recommends the new **publishable key** (`sb_publishable_...`) over the legacy anon key (JWT format). Both work identically with `supabase-js`, but publishable keys support independent rotation and are the forward-compatible choice.

### Step 4: Create Database Schema

Run these SQL statements in **Supabase Dashboard → SQL Editor**:

```sql
-- ============================================
-- USERS (extends Supabase Auth)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  stable_name TEXT NOT NULL DEFAULT 'My Stable',
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  next_level_xp INTEGER NOT NULL DEFAULT 1000,
  hay_coins INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MILESTONES (reference/content data)
-- ============================================
CREATE TABLE public.milestones (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📚',
  sort_order INTEGER NOT NULL DEFAULT 0,
  map_x NUMERIC NOT NULL DEFAULT 50,
  map_y NUMERIC NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USER MILESTONE PROGRESS (per-user state)
-- ============================================
CREATE TABLE public.user_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_id INTEGER NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in-progress', 'completed')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, milestone_id)
);

-- ============================================
-- QUESTIONS (content data)
-- ============================================
CREATE TABLE public.questions (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER REFERENCES public.milestones(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- HANGMAN WORDS (content data)
-- ============================================
CREATE TABLE public.hangman_words (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  hint TEXT NOT NULL,
  milestone_id INTEGER REFERENCES public.milestones(id) ON DELETE SET NULL,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- QUIZ ATTEMPTS (user activity tracking)
-- ============================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES public.milestones(id),
  topic TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DAILY CHORES (content + user state)
-- ============================================
CREATE TABLE public.daily_chores (
  id SERIAL PRIMARY KEY,
  task TEXT NOT NULL,
  reward_xp INTEGER NOT NULL DEFAULT 10,
  reward_label TEXT NOT NULL DEFAULT '10 XP',
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE public.user_chores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chore_id INTEGER NOT NULL REFERENCES public.daily_chores(id) ON DELETE CASCADE,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, chore_id, completed_at)
);

-- ============================================
-- HORSES (unlockable collectibles)
-- ============================================
CREATE TABLE public.horses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  milestone_id INTEGER REFERENCES public.milestones(id),
  icon TEXT NOT NULL DEFAULT '🐴',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  horse_id INTEGER NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
  custom_name TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, horse_id)
);

-- ============================================
-- BADGES / ACHIEVEMENTS
-- ============================================
CREATE TABLE public.badges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🏅',
  criteria TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- PROJECT SUBMISSIONS
-- ============================================
CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_id INTEGER NOT NULL REFERENCES public.milestones(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  file_urls JSONB NOT NULL DEFAULT '[]',
  self_assessment JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles: users can read all profiles (leaderboard), but only edit own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User milestones: users can only see/edit their own
ALTER TABLE public.user_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones"
  ON public.user_milestones FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON public.user_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON public.user_milestones FOR UPDATE USING (auth.uid() = user_id);

-- Content tables: readable by all authenticated users
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hangman_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content readable by authenticated" ON public.milestones
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content readable by authenticated" ON public.questions
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content readable by authenticated" ON public.hangman_words
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content readable by authenticated" ON public.daily_chores
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content readable by authenticated" ON public.horses
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Content readable by authenticated" ON public.badges
  FOR SELECT USING (auth.role() = 'authenticated');

-- User-specific tables: own data only
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own data only" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data only" ON public.user_chores
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data only" ON public.user_horses
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data only" ON public.user_badges
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Own data only" ON public.project_submissions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- USEFUL VIEWS
-- ============================================

-- Leaderboard view
CREATE VIEW public.leaderboard AS
  SELECT
    id,
    name,
    xp,
    level,
    avatar_url,
    RANK() OVER (ORDER BY xp DESC) as rank
  FROM public.profiles
  ORDER BY xp DESC;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_user_milestones_user ON public.user_milestones(user_id);
CREATE INDEX idx_questions_topic ON public.questions(topic);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX idx_profiles_xp ON public.profiles(xp DESC);
```

### Step 5: Seed Content Data

Run in SQL Editor after schema creation:

```sql
-- Seed milestones
INSERT INTO public.milestones (id, title, topic, icon, sort_order, map_x, map_y) VALUES
  (1, 'Training Arena', 'SDLC & DevOps', '🏟️', 1, 10, 80),
  (2, 'Feed Storage', 'Data & SQL', '🥕', 2, 30, 60),
  (3, 'Pasture Fields', 'Cloud Infra', '☁️', 3, 28, 36),
  (4, 'Stable Complex', 'System Design', '🏠', 4, 50, 24),
  (5, 'Riding Trails', 'APIs & Integrations', '🛤️', 5, 75, 30),
  (6, 'Breeding Barn', 'Machine Learning', '🧬', 6, 65, 65),
  (7, 'Show Arena', 'GenAI & LLMs', '✨', 7, 90, 85);

-- Seed questions (database topic)
INSERT INTO public.questions (milestone_id, topic, question, options, correct_index, explanation) VALUES
  (2, 'database', 'Which component of the stable best represents a SQL Database?',
   '["The Riding Arena (Where actions happen)", "The Feed Storage (Where resources are organized and stored)", "The Trails (How we connect to outside)", "The Fence (Security layer)"]',
   1, 'Correct! The Feed Storage organizes resources (data) in specific bins (tables) so they can be retrieved efficiently when needed.'),
  (2, 'database', 'If you want to ask for specific data, which command do you use?',
   '["FETCH", "GET", "SELECT", "GIVE"]',
   2, 'Correct! SELECT is the SQL command used to retrieve specific data from a database table.'),
  (2, 'database', 'What is a ''Schema'' in our stable analogy?',
   '["The blueprint of the barn layout", "The list of horses", "The schedule for feeding", "The lock on the door"]',
   0, 'Spot on! A Schema is the structural design or blueprint of the database, just like the architectural plan of your stable.');

-- Seed questions (SDLC topic)
INSERT INTO public.questions (milestone_id, topic, question, options, correct_index, explanation) VALUES
  (1, 'sdlc', 'What does SDLC stand for in software development?',
   '["Stable Development Life Cycle", "Software Development Life Cycle", "System Design Logic Code", "Software Deployment Live Check"]',
   1, 'Correct! SDLC stands for Software Development Life Cycle.'),
  (1, 'sdlc', 'Which phase comes immediately after Planning in the SDLC?',
   '["Testing", "Deployment", "Analysis/Design", "Maintenance"]',
   2, 'Correct! After Planning comes Analysis/Design phase.'),
  (1, 'sdlc', 'In our stable analogy, what does ''Refactoring'' equate to?',
   '["Buying a new horse", "Grooming and cleaning", "Feeding time", "Racing day"]',
   1, 'Correct! Refactoring is like grooming and cleaning - improving code without changing functionality.');

-- Seed hangman words
INSERT INTO public.hangman_words (word, hint, difficulty) VALUES
  ('DATABASE', 'Where the stable stores its feed', 'easy'),
  ('API', 'The trail connecting different stables', 'easy'),
  ('CLOUD', 'The sky above the pasture', 'easy'),
  ('SERVER', 'The barn that houses the horses', 'medium'),
  ('FRONTEND', 'The part of the stable visitors see', 'medium');

-- Seed horses
INSERT INTO public.horses (name, breed, milestone_id, icon, description) VALUES
  ('Pipeline', 'DevOps Drafter', 1, '🐴', 'Reliable and consistent, always delivers on time.'),
  ('Query', 'SQL Stallion', 2, '🐎', 'Can find any needle in any haystack.'),
  ('Nimbus', 'Cloud Courser', 3, '🦄', 'Runs with head in the clouds but hooves on the ground.'),
  ('Blueprint', 'Architect Arabian', 4, '🏇', 'Elegant structure, built for complex landscapes.'),
  ('Connector', 'API Appaloosa', 5, '🐴', 'Bridges every gap between stables.'),
  ('Darwin', 'ML Mustang', 6, '🦓', 'Learns and adapts from every ride.'),
  ('Ava', 'GenAI Thoroughbred', 7, '✨', 'The showstopper, creates magic in the arena.');

-- Seed daily chores
INSERT INTO public.daily_chores (task, reward_xp, reward_label) VALUES
  ('Complete a Quiz', 50, '50 XP'),
  ('Review Flashcards', 20, '20 XP'),
  ('Pet your horse', 10, '10 XP'),
  ('Play Hangman', 25, '25 Hay Coins');

-- Seed badges
INSERT INTO public.badges (name, description, icon, criteria) VALUES
  ('First Ride', 'Complete your first lesson', '🎠', 'complete_first_lesson'),
  ('Bug Hunter', 'Score 100% on any quiz', '🐛', 'perfect_quiz'),
  ('Clean Code', 'Complete all SDLC lessons', '✨', 'complete_milestone_1'),
  ('Night Owl', 'Study after 10 PM', '🦉', 'study_late'),
  ('Streak Star', 'Maintain a 7-day streak', '⭐', 'streak_7'),
  ('Stable Master', 'Complete all milestones', '👑', 'complete_all');
```

### Step 6: Create Storage Bucket for Project Uploads

In Supabase Dashboard → Storage:

1. Create bucket: `project-submissions`
2. Set to **private** (only authenticated users via RLS)
3. Add policy: Users can upload to their own folder

```sql
-- Storage policy (run in SQL editor)
CREATE POLICY "Users can upload own submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-submissions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Step 7: Enable Auth Providers

In Supabase Dashboard → Authentication → Providers:

1. **Email/Password**: Enabled by default (use this for local testing)
2. **Magic Links**: Optional; enabled by default for passwordless email login

### Step 8: Create Auth Context in React ✅

Implemented in `src/lib/auth/authContext.tsx` and `src/lib/auth/ProtectedRoute.tsx`. When Supabase is not configured, auth methods no-op and `isConfigured` is false so the app works with static data.

Create `src/lib/auth/authContext.tsx` (reference):

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Step 9: Implement SupabaseDataService

Replace `StaticDataService` with `SupabaseDataService` in `src/lib/services/data.service.ts`:

```typescript
import { supabase } from '../supabase';
import type { IDataService } from './data.service';

class SupabaseDataService implements IDataService {
  async getQuestions(topic?: string) {
    let query = supabase.from('questions').select('*');
    if (topic) query = query.eq('topic', topic);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(q => ({
      id: q.id,
      question: q.question,
      options: q.options as string[],
      correct: q.correct_index,
      explanation: q.explanation,
    }));
  }

  async getHangmanWords() {
    const { data, error } = await supabase.from('hangman_words').select('word, hint');
    if (error) throw error;
    return data ?? [];
  }

  async getMilestones() {
    const user = (await supabase.auth.getUser()).data.user;
    const { data: milestones } = await supabase
      .from('milestones')
      .select('*, user_milestones(*)')
      .order('sort_order');
    // Map to Milestone type with user progress
    return (milestones ?? []).map(m => ({
      id: m.id,
      title: m.title,
      topic: m.topic,
      icon: m.icon,
      status: m.user_milestones?.[0]?.status ?? 'locked',
      progress: m.user_milestones?.[0]?.progress ?? 0,
      completedAt: m.user_milestones?.[0]?.completed_at,
    }));
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return {
      id: data.id,
      name: data.name,
      stableName: data.stable_name,
      level: data.level,
      xp: data.xp,
      nextLevelXp: data.next_level_xp,
      streak: data.streak,
      avatarUrl: data.avatar_url,
      joinDate: new Date(data.created_at),
    };
  }

  async getLeaderboard(limit = 10) {
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);
    return (data ?? []).map(entry => ({
      name: entry.name,
      xp: entry.xp,
      rank: entry.rank,
    }));
  }

  // ... implement remaining methods following same pattern
}
```

### Step 10: Generate TypeScript Types from Supabase

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/types/database.ts
```

This auto-generates a `Database` type that gives you full type safety on all Supabase queries.

---

## Implementation Order (Recommended)

### Phase 1: Foundation (Day 1)
1. ✅ Create Supabase project
2. ✅ Run schema SQL
3. ✅ Seed content data
4. ✅ Install `@supabase/supabase-js`
5. ✅ Create `supabase.ts` client
6. ✅ Generate TypeScript types

### Phase 2: Auth (Day 1-2)
1. Enable auth providers in dashboard (Supabase Dashboard → Authentication → Providers)
2. ✅ Create `AuthContext` and `AuthProvider` (`src/lib/auth/authContext.tsx`)
3. ✅ Wrap app in `AuthProvider` (`main.tsx`)
4. ✅ Add login/signup flow to `LandingPage` (email/password modals)
5. ✅ Protect routes via `ProtectedRoute` (redirect to `/` when Supabase configured and not authenticated)

### Phase 3: Data Migration (Day 2-3)
1. ✅ Implement `SupabaseDataService` (`src/lib/services/supabase-data.service.ts`)
2. ✅ Swap to `SupabaseDataService` when `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set; otherwise fall back to `StaticDataService` so the app runs without backend
3. Test each page still works (with auth for dashboard when using Supabase)
4. Remove static data files (or keep as fallback)

### Phase 4: User State (Day 3-4)
1. Save quiz attempts to `quiz_attempts` table
2. Track milestone progress in `user_milestones`
3. Implement XP/level calculations
4. Implement streak tracking
5. Wire up daily chores completion

### Phase 5: Storage & Extras (Day 4-5)
1. Set up Storage bucket
2. Implement file upload in `ProjectSubmission` page
3. Wire up leaderboard with real-time subscription
4. Implement horse unlocking on milestone completion

---

## Ready for local testing with Supabase

Before running the app against Supabase locally, confirm:

1. **Supabase project** – Created at [supabase.com](https://supabase.com), schema and seed data applied (tables exist, content seeded).
2. **`.env.local`** – In project root, with:
   - `VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...` (or legacy anon key)
3. **Auth** – Email/Password provider enabled in Supabase Dashboard → Authentication → Providers (default).
4. **Dev server** – Run `npm run dev` (or `pnpm dev`); open the app in the browser.

**Flow:** Open `/` → click **Get Started** or **Login** → sign up (or log in) with email/password → you are redirected to `/dashboard`. Profile is created automatically via `handle_new_user` trigger. Data (milestones, questions, leaderboard, etc.) is loaded from Supabase. Sign out from the sidebar returns you to `/`.

**Without `.env.local`:** The app uses `StaticDataService` and mock data; no auth is required and **Login** / **Get Started** go straight to the dashboard.

---

## Key Architecture Decisions

### Direct Client vs. Edge Functions

**Use Supabase client directly** for:
- Reading content (questions, milestones, words)
- Reading user profile
- File uploads
- Auth operations

**Use Edge Functions** for:
- XP award calculations (prevent client-side cheating)
- Streak validation (server-side date checking)
- Level-up logic (ensure consistency)
- Badge/achievement awarding (complex criteria)

### Data Ownership

| Table | Who writes | Who reads |
|---|---|---|
| milestones | Admin (seed) | All authenticated users |
| questions | Admin (seed) | All authenticated users |
| hangman_words | Admin (seed) | All authenticated users |
| profiles | Auto-created + user edits | Everyone (leaderboard) |
| user_milestones | User (via app) | Owner only |
| quiz_attempts | User (via app) | Owner only |
| project_submissions | User (via app) | Owner only |

### Environment Setup

```
.env.local (gitignored)
├── VITE_SUPABASE_URL=https://xxx.supabase.co
└── VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

.env.example (committed)
├── VITE_SUPABASE_URL=your-supabase-url
└── VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```
