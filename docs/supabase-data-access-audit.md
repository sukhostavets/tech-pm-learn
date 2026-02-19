# Supabase Data Access Audit

After completing the [Supabase Integration Plan](./supabase-integration-plan.md), this document maps **where in the app** we should read from or write to Supabase (via `dataService` or direct client).

---

## Summary

| Area | Read | Write |
|------|------|--------|
| Dashboard | user, milestones, chores, leaderboard | — |
| Milestone Map | milestones | — |
| Lesson View | milestone/lesson content, user progress | user_milestones (progress) |
| Quiz (QuizPage / QuizView) | questions | quiz_attempts, user_milestones, profiles (XP) |
| Hangman | hangman_words | — (optional: track win for chores/XP) |
| Daily Chores | daily_chores, user_chores | user_chores (complete chore) |
| Profile | profile, user_horses, user_badges | profiles (edit name, stable_name, avatar) |
| Project Submission | milestone/project context | project_submissions, storage (files) |
| Layout | — | — (auth only; optional: profile for hay coins) |
| Leaderboard | leaderboard view | — |

---

## 1. Dashboard

**File:** `src/app/pages/Dashboard.tsx`  
**Current:** Hardcoded `user`, `milestones`, daily chores list, leaderboard.  
**Refactor reference:** `Dashboard.refactored.example.tsx` uses `dataService` for read-only.

### Read (via dataService)

| Data | Method | Table(s) |
|------|--------|----------|
| Current user (name, stableName, level, xp, nextLevelXp, streak) | `dataService.getCurrentUser()` | `profiles` |
| Milestones with status/progress | `dataService.getMilestones()` | `milestones`, `user_milestones` |
| Daily chores with completed state | `dataService.getDailyChores()` | `daily_chores`, `user_chores` |
| Leaderboard (top N) | `dataService.getLeaderboard(limit)` | `leaderboard` (view on `profiles`) |

### Write

- None on the dashboard itself. Chore toggles (see Daily Chores below) are the only writes from the “dashboard area” when using `ChoreItem` with `onToggle`.

**Action:** Switch `Dashboard.tsx` to load from `dataService` (same pattern as `Dashboard.refactored.example.tsx`). Use `ChoreItem` with `onToggle` that calls a new “complete chore” write (see §6).

---

## 2. Milestone Map

**File:** `src/app/pages/MilestoneMap.tsx`  
**Current:** Hardcoded `milestones` array (id, x, y, title, icon, status).

### Read

| Data | Method | Table(s) |
|------|--------|----------|
| Milestones with map position and status | `dataService.getMilestones()` | `milestones` (map_x, map_y), `user_milestones` (status) |

**Action:** Load milestones from `dataService.getMilestones()`. Ensure `SupabaseDataService.getMilestones()` returns `map_x`/`map_y` if present in schema (extend type/select if needed). Map route should accept optional milestone id (e.g. `/map/:milestoneId?`) so “View Full Map” and “open lesson for this milestone” work.

---

## 3. Lesson View

**File:** `src/app/pages/LessonView.tsx`  
**Current:** Single hardcoded lesson (title, module, sections). No milestone id in URL.

### Read

| Data | Method | Table(s) |
|------|--------|----------|
| Milestone by id (for title, topic, lesson content) | `dataService.getMilestoneById(id)` | `milestones` |
| User progress for this milestone | Already in `getMilestoneById` / `user_milestones` | `user_milestones` |

Lesson **content** (sections) is not in the current DB schema. Options: (a) keep content in code per milestone id, or (b) add a `lesson_content` or `milestone_sections` table later. For now, treat “read” as milestone metadata + progress.

### Write

| When | Data | Table | Notes |
|------|------|--------|--------|
| User opens lesson / starts milestone | status = 'in-progress', progress = 0 or current | `user_milestones` | Upsert for (user_id, milestone_id). |
| User completes lesson (e.g. “Take Quiz”) | progress updated (e.g. 50% “lesson done”) | `user_milestones` | Optional; can be merged with quiz completion. |

**Action:** Route lesson by milestone id (e.g. `/lesson/:milestoneId`). Load `dataService.getMilestoneById(milestoneId)`. On enter, ensure `user_milestones` has status `in-progress` (insert or update). Optionally update progress when user finishes the lesson step.

---

## 4. Quiz (QuizPage / QuizView)

**Files:** `src/app/pages/QuizPage.tsx`, `src/app/components/quiz/` (e.g. used via `QuizView.tsx`).  
**Current:** Hardcoded questions in each page; no topic/milestone; no persistence.

### Read

| Data | Method | Table(s) |
|------|--------|----------|
| Questions for topic or milestone | `dataService.getQuestions(topic)` or by milestone | `questions` |

**Action:** Resolve topic or milestone id from route/context (e.g. `/quiz/:milestoneId` or `?topic=...`). Load questions with `dataService.getQuestions(topic)` (or extend interface for milestone-scoped questions).

### Write

| When | Data | Table(s) | Notes |
|------|------|----------|--------|
| Quiz completed | score, total, passed, xp_earned, milestone_id, topic | `quiz_attempts` | One row per attempt. |
| Quiz passed (and optionally lesson done) | status = 'completed', progress = 100, completed_at | `user_milestones` | For the milestone tied to the quiz. |
| XP / level / streak | level, xp, next_level_xp, streak, last_activity_date | `profiles` | Prefer Edge Function for XP/level/streak to avoid client-side cheating; otherwise update in app. |
| Horse unlock on pass | insert | `user_horses` | When quiz passes and milestone has a horse reward. |
| Badge (e.g. perfect score) | insert | `user_badges` | When criteria met (e.g. perfect_quiz). |

**Action:** After quiz completion (in `QuizPage` or wherever `onComplete(score)` is used):  
1. Call a service method that inserts into `quiz_attempts`.  
2. If passed, upsert `user_milestones` (completed), optionally unlock horse in `user_horses`, and award XP (via Edge Function or `profiles` update).  
3. Optionally award badges (e.g. `user_badges`) when criteria are met.

---

## 5. Hangman Game

**File:** `src/app/pages/HangmanGame.tsx`  
**Current:** Hardcoded `WORDS` array (word, hint).

### Read

| Data | Method | Table(s) |
|------|--------|----------|
| Words and hints | `dataService.getHangmanWords()` | `hangman_words` |

**Action:** On mount, load words with `dataService.getHangmanWords()` and use that list (with optional difficulty filter from schema later).

### Write (optional)

| When | Data | Table(s) | Notes |
|------|------|----------|--------|
| Game won | — | `user_chores` | If “Play Hangman” is a daily chore, mark it complete for today. |
| XP / hay coins | — | `profiles` | If we give reward for hangman win; prefer Edge Function. |

**Action:** Replace hardcoded `WORDS` with `dataService.getHangmanWords()`. Optionally, when game is won, call the same “complete chore” logic used by dashboard for the “Play Hangman” chore (see §6).

---

## 6. Daily Chores

**Files:** `src/app/components/dashboard/ChoreItem.tsx`, Dashboard (when using refactored flow).  
**Current:** Chores loaded via `dataService.getDailyChores()` in refactored example; `ChoreItem` exposes `onToggle(choreId)` but no write implemented.

### Read

- Already covered by Dashboard: `dataService.getDailyChores()` (chores + completed state from `user_chores`).

### Write

| When | Data | Table(s) | Notes |
|------|------|----------|--------|
| User ticks a chore | user_id, chore_id, completed_at = today | `user_chores` | Insert one row per (user, chore, date). |
| Optional: award XP / hay coins | — | `profiles` | Per chore type (e.g. reward_xp from `daily_chores`); prefer Edge Function. |

**Action:** Add to `IDataService` (and implementations): e.g. `completeChore(choreId: string): Promise<void>` that inserts into `user_chores` for current user and today. In Dashboard, pass `onToggle` that calls `dataService.completeChore(chore.id)` and then refetches chores (or invalidates cache). Ensure `chore_id` is numeric in DB and map `chore.id` (string) to it.

---

## 7. Profile Page

**File:** `src/app/pages/ProfilePage.tsx`  
**Current:** Hardcoded user (name, title, stableName, joinDate, horses, badges).

### Read

| Data | Method | Table(s) |
|------|--------|----------|
| Full profile (with title, horses, badges) | `dataService.getUserProfile(userId)` | `profiles`, `user_horses` (+ `horses`), `user_badges` (+ `badges`) |

Use current user id from auth (e.g. `useAuth().user?.id`). When Supabase is configured, load profile via `dataService.getUserProfile(userId)`.

### Write

| When | Data | Table(s) | Notes |
|------|------|----------|--------|
| Edit profile | name, stable_name, avatar_url | `profiles` | RLS: user can only update own row. |

**Action:** Replace hardcoded user with `dataService.getUserProfile(currentUserId)`. Add “Edit Profile” flow (modal or inline) that updates `profiles` (name, stable_name, and optionally avatar_url via Storage then set URL on profile).

---

## 8. Project Submission

**File:** `src/app/pages/ProjectSubmission.tsx`  
**Current:** Local state only; “upload” is a timeout simulation; no milestone/project id.

### Read

| Data | Method | Table(s) | Notes |
|------|--------|----------|--------|
| Project/milestone context | `dataService.getMilestoneById(milestoneId)` or similar | `milestones`, optionally `project_submissions` | For title, description, checklist. |
| Existing submission (draft) | — | `project_submissions` | Optional: load draft by user + milestone. |

**Action:** Route by milestone (e.g. `/project/submission/:milestoneId`). Load milestone/project description from `dataService.getMilestoneById(milestoneId)` (or a dedicated “project brief” if we add it). Optionally load existing draft from `project_submissions`.

### Write

| When | Data | Table(s) | Notes |
|------|------|----------|--------|
| Upload file(s) | file binary | Storage bucket `project-submissions` | Path e.g. `{user_id}/{submission_id}/{filename}`. |
| Save draft | title, description, file_urls, status = 'draft' | `project_submissions` | Upsert by (user_id, milestone_id). |
| Submit | status = 'submitted', submitted_at, file_urls | `project_submissions` | Same row; set file_urls from Storage upload results. |

**Action:** On submit:  
1. Upload files to Supabase Storage (`project-submissions` bucket, user-scoped path).  
2. Insert or update `project_submissions` with title, description, `file_urls` (from Storage), status `draft` or `submitted`, and `submitted_at` when submitting.  
Add to `IDataService` (or a dedicated service): e.g. `uploadProjectFiles(files)`, `saveProjectSubmission(milestoneId, payload)`, `submitProject(milestoneId, payload)`.

---

## 9. Layout (sidebar / header)

**File:** `src/app/components/layout/Layout.tsx`  
**Current:** Uses `useAuth()` for user avatar and name; “1,250 Hay Coins” is hardcoded.

### Read (optional)

| Data | Method | Table(s) | Notes |
|------|--------|----------|--------|
| Hay coins (or other profile stats) | `dataService.getCurrentUser()` or a light “profile stats” API | `profiles` (e.g. hay_coins) | Only if we show real hay coins in header. |

**Action:** If we persist `hay_coins` on `profiles`, load current user (or a minimal profile) in Layout and display `hay_coins` instead of hardcoded value. Otherwise leave as-is until that feature is implemented.

---

## 10. Leaderboard

**Current:** Shown on Dashboard via `dataService.getLeaderboard()` in the refactored example; main Dashboard uses hardcoded list.

### Read

- Already covered: `dataService.getLeaderboard(limit)` (view `leaderboard`).

### Write

- None.

**Action:** When Dashboard is refactored to use dataService, leaderboard is already read from Supabase. No extra write points.

---

## 11. Auth and profile creation

**Files:** `src/lib/auth/authContext.tsx`, Supabase trigger.  
**Current:** Auth is implemented; `handle_new_user` trigger creates `profiles` row on sign-up.

### Write

- Profile creation: done by DB trigger on `auth.users` insert.  
- No app code change needed for profile creation; ensure sign-up passes `name` (and optionally `avatar_url`) in `user_metadata` so the trigger can fill `profiles.name` and `profiles.avatar_url`.

---

## Implementation order (by dependency)

1. **Dashboard** – Switch to dataService for read (user, milestones, chores, leaderboard). Add chore completion write and wire `ChoreItem.onToggle`.
2. **Milestone Map** – Load milestones from dataService; add route param if needed.
3. **Lesson View** – Route by milestone id; read milestone + progress; write `user_milestones` (in-progress / progress).
4. **Quiz** – Load questions from dataService by topic/milestone; on completion write `quiz_attempts`, `user_milestones`, `profiles` (or Edge Function for XP), optionally `user_horses` and `user_badges`.
5. **Hangman** – Load words from dataService; optionally mark chore complete on win.
6. **Profile** – Read via `getUserProfile`; add profile update (name, stable_name, avatar).
7. **Project Submission** – Storage upload + `project_submissions` insert/update; read milestone/project context.
8. **Layout** – Optional: show real hay coins from profile.

This order keeps reads first (so UI uses real data), then adds writes for chores, quiz, lesson progress, profile, and projects.
