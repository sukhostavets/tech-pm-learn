# Supabase Data Access Audit

After completing the [Supabase Integration Plan](./supabase-integration-plan.md), this document maps **where in the app** we read from or write to Supabase. Items already implemented are summarized; remaining work is detailed below.

---

## Plan: Remove project submission for MVP

Project submission is out of scope for MVP. Use this checklist to remove it cleanly.

### 1. App code
- [x] **App.tsx** — Remove `import { ProjectSubmission } from './pages/ProjectSubmission'` and the route `<Route path="/project/submission" element={<ProjectSubmission />} />`.
- [x] **ProjectSubmission.tsx** — Delete `src/app/pages/ProjectSubmission.tsx`.

### 2. Types (optional)
- [ ] **database.ts** — Leave as-is (generated from Supabase). If you later drop the `project_submissions` table in DB, regenerate types with `npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts` and the type will disappear.

### 3. Docs
- [x] **supabase-data-access-audit.md** — Project submission row/section removed (this file).
- [x] **supabase-integration-plan.md** — Remove or defer Step 6 (Storage bucket for project-submissions), Phase 5 project submission items, and `project_submissions` from Data Ownership table (or mark “deferred”).
- [x] **ui-completion-plan.md** — Remove “Project Submission” from suggested implementation order.
- [x] **REUSABLE_COMPONENTS.md** — Remove or reword the ProjectSubmission usage mention (line ~20, ~145).

### 4. Database (optional for MVP)
- [ ] **Table** — You can leave `project_submissions` in place (no app code uses it). To drop: run `DROP TABLE public.project_submissions;` and remove any Storage bucket `project-submissions` and its RLS policies if they were created.

### Order
Do 1 → 3 so the app and docs are consistent. Do 2 and 4 when/if you change the schema.

---

## Summary

| Area | Read | Write | Status |
|------|------|--------|--------|
| Dashboard | user, milestones, chores, leaderboard, horses count | — | ✅ |
| Milestone Map | milestones | — | ✅ |
| Lesson View | milestone, progress | user_milestones (in-progress) | ✅ |
| Quiz | questions | quiz_attempts, user_milestones, profiles (XP) | ✅ |
| Hangman | hangman_words | user_chores (on win) | ✅ |
| Daily Chores | daily_chores, user_chores | user_chores (completeChore) | ✅ |
| Profile | getUserProfile | profiles (name, stable_name, avatar) | ✅ |
| Layout | profile (hay coins) | — | ✅ |
| Leaderboard | leaderboard view | — | ✅ |
| Auth | — | — | ✅ (trigger creates profile) |

---

## Other remaining (see Integration Plan)

- **Level-up logic** — when `profiles.xp` crosses `next_level_xp`, update `level` and `next_level_xp` (client or Edge Function).
- **Streak** — update `profiles.streak` and `last_activity_date` on relevant activity.
- **Horse unlock** — on milestone completion (e.g. quiz pass), insert into `user_horses` for the milestone’s horse if configured.

---

## Implementation order (remaining)

1. **Level / streak / horse unlock** — as needed for product (see Phase 4 in supabase-integration-plan.md).
