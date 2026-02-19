# UI Completion Plan

Prioritized list of unimplemented/placeholder UI elements, with verdicts on importance and DB impact.

---

## Priority: Must Fix (broken / misleading UX)

### 1. Horses Collected stat — hardcoded "—"

**File:** `Dashboard.tsx` (StatsCard)  
**Problem:** Stat card exists but shows a dash; feels broken.  
**Fix:** Query `user_horses` count + total `horses` count. The tables already exist.  
**DB change:** None. `user_horses` and `horses` are in the schema.  
**Effort:** Small — add a `getHorsesCount()` method or fold into `getCurrentUser`.

### 2. Hay Coins — hardcoded "1,250"

**File:** `Layout.tsx` (desktop top bar)  
**Problem:** Shows fake coins. `profiles.hay_coins` already exists in DB but is never read.  
**Fix:** Read `hay_coins` from the user profile and display it. Could reuse `getCurrentUser` (add `hayCoins` to User type) or do a lightweight fetch in Layout.  
**DB change:** None. Column exists.  
**Effort:** Small — add field to `User` type, include in `profileToUser`, display in Layout.

---

## Priority: Should Fix (real value, quick)

### 4. WelcomeBanner subtitle — hardcoded progress text

**File:** `WelcomeBanner.tsx`  
**Problem:** Always says "75% of the way to mastering SQL" regardless of actual state.  
**Fix:** Derive from milestones data (e.g. find the in-progress milestone's progress + title).  
**DB change:** None.  
**Effort:** Small — pass milestones or a summary to WelcomeBanner.

### 5. "View Daily Quests" button — no-op

**File:** `Dashboard.tsx` → `WelcomeBanner`  
**Problem:** Button renders but does nothing.  
**Fix:** Either scroll to the Daily Chores card, or remove the button.  
**Recommendation:** **Remove** — chores are already visible on the Dashboard sidebar; the button adds confusion.  
**DB change:** None.  
**Effort:** Trivial.

### 6. Sidebar subtitle fallback — "Lvl 5 Rancher"

**File:** `Layout.tsx` (user profile mini, email fallback)  
**Problem:** When email is missing, shows hardcoded "Lvl 5 Rancher" as subtitle.  
**Fix:** Use real profile data (level, stable name) from auth or a lightweight profile fetch.  
**DB change:** None.  
**Effort:** Small.

---

## Priority: Nice to Have (polish, not blocking)

### 7. Achievements page — placeholder

**File:** `App.tsx` route, `Layout.tsx` sidebar link  
**Problem:** "Coming soon to your stable!" placeholder.  
**Fix:** Build a page that reads from `user_badges` + `badges` tables.  
**DB change:** None. Tables exist.  
**Effort:** Medium — new page, load badges, show earned vs locked.

### 8. Hangman — no nav link + no chore/XP on win

**File:** `HangmanGame.tsx`, `Layout.tsx`  
**Problem:** Reachable only by direct URL; winning doesn't count toward anything.  
**Fix:** (a) Add a link from Dashboard (e.g. in a "Mini Games" card or from the "Play Hangman" chore). (b) On win, call `completeChore` for the "Play Hangman" chore.  
**DB change:** None.  
**Effort:** Small–Medium.

### 9. Bell / Notifications — no action

**File:** `Layout.tsx` (header + mobile)  
**Problem:** Bell icon with fake red dot, no click handler.  
**Fix:** Either implement a notifications system, or **remove** the bell until ready.  
**Recommendation:** **Remove for now** — no notifications table or logic exists; fake dot is misleading.  
**DB change:** Would need a `notifications` table if implemented; not in current schema.  
**Effort:** Trivial to remove; Large to implement.

---

## Redundant / Should Remove

### 10. `Dashboard.refactored.example.tsx`

**File:** `src/app/pages/Dashboard.refactored.example.tsx`  
**Problem:** Was a reference for how to wire `dataService`; now `Dashboard.tsx` does exactly this.  
**Verdict:** **Delete.** No longer needed.

### 11. `QuizPage.refactored.example.tsx`

**File:** `src/app/pages/QuizPage.refactored.example.tsx`  
**Problem:** Same — example that's been superseded by the real QuizPage.  
**Verdict:** **Delete.**

### 12. `QuizView.tsx`

**File:** `src/app/pages/QuizView.tsx`  
**Problem:** Unused component (no route, no import from active code). Has its own hardcoded questions and a different UI style.  
**Verdict:** **Delete** unless you want to keep the alternate UI for later.

### 13. Profile "Manage Stable" button

**File:** `ProfilePage.tsx`  
**Problem:** Button with no handler.  
**Verdict:** **Remove** — there's no "manage stable" feature or page planned.

### 14. Profile "Next unlock at Lvl 6" placeholder slot

**File:** `ProfilePage.tsx`  
**Problem:** Hardcoded empty slot in horse grid.  
**Fix:** Either derive from actual next-unlock logic (horses linked to milestones), or **remove** the placeholder slot until the unlock flow exists.  
**Recommendation:** Keep but make text dynamic based on user level, or remove.  
**Effort:** Trivial to remove; Small to make dynamic.

---

## Deferred (content / design decision)

### 15. Lesson content — same for all milestones

**File:** `LessonView.tsx` (DEFAULT_SECTIONS)  
**Problem:** Every milestone shows the same placeholder content.  
**Fix options:**  
  (a) Build a `lesson_sections` table with content per milestone.  
  (b) Keep content in code as a static map of `milestoneId → sections[]`.  
**DB change:** Option (a) needs a **new table**; option (b) needs no DB change.  
**Recommendation:** Start with (b) — a code-level map — since lesson content is authored, not user-generated. Migrate to DB later if content management is needed.  
**Effort:** Medium (writing actual content per milestone).

### 16. Lesson "Interactive Placeholder"

**File:** `LessonView.tsx` (DEFAULT_SECTIONS, "Try It Yourself" section)  
**Problem:** Static box where a drag-and-drop activity should be.  
**Verdict:** **Defer** — interactive activities are a feature unto themselves.  
**DB change:** None for now.

---

## DB changes summary

| Item | New table? | New column? | Notes |
|------|-----------|-------------|-------|
| Horses count (#1) | No | No | Read `user_horses` + `horses` |
| Hay coins (#2) | No | No | `profiles.hay_coins` exists |
| Project upload (#3) | No | No | `project_submissions` + Storage bucket exist |
| Achievements (#7) | No | No | `badges` + `user_badges` exist |
| Notifications (#9) | **Yes** | — | Only if implemented; recommend removing bell for now |
| Lesson content (#15) | **Optional** | — | `lesson_sections` table only if content moves to DB |

**Bottom line:** The current DB schema covers everything except notifications and optional lesson content. No migrations are needed for the top-priority items.

---

## Suggested implementation order

1. **Remove redundant** — delete example files, remove "Manage Stable" button, "View Daily Quests" button, bell icon (#5, #9, #10, #11, #12, #13)
2. **Hay Coins** — read from profile, display in Layout (#2)
3. **Horses Collected** — count from `user_horses` / `horses` (#1)
4. **WelcomeBanner subtitle** — derive from milestone data (#4)
5. **Sidebar subtitle** — use real level (#6)
6. **Hangman nav link** — add entry point from Dashboard (#8)
7. **Achievements page** — build real badges UI (#7)
8. **Project Submission** — wire Storage upload + DB insert (#3)
9. **Lesson content** — per-milestone content map (#15)
