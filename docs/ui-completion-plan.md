# UI Completion Plan

Prioritized list of unimplemented/placeholder UI elements, with verdicts on importance and DB impact.

---

## Priority: Should Fix (real value, quick)

### 1. Achievements page — placeholder

**File:** `App.tsx` route, `Layout.tsx` sidebar link  
**Problem:** "Coming soon to your stable!" placeholder.  
**Fix:** Build a page that reads from `user_badges` + `badges` tables.  
**DB change:** None. Tables exist.  
**Effort:** Medium — new page, load badges, show earned vs locked.

### 2. Hangman — no nav link (chore/XP on win done)

**File:** `Layout.tsx`  
**Problem:** No direct nav link in sidebar; game is reachable via Dashboard "Play Hangman" chore and winning counts toward chore.  
**Fix:** (a) Optionally add a link from Dashboard (e.g. in a "Mini Games" card) or sidebar. (b) Already done: on win, `completeChore` for "Play Hangman" chore.  
**DB change:** None.  
**Effort:** Trivial if adding nav only.

---

## Priority: Nice to Have (polish, not blocking)

### 3. Bell / Notifications — no action

**File:** `Layout.tsx` (header + mobile)  
**Problem:** Bell icon with fake red dot, no click handler.  
**Fix:** Either implement a notifications system, or **remove** the bell until ready.  
**Recommendation:** **Remove for now** — no notifications table or logic exists; fake dot is misleading.  
**DB change:** Would need a `notifications` table if implemented; not in current schema.  
**Effort:** Trivial to remove; Large to implement.

---

## Redundant / Should Remove

### 4. Profile "Next unlock at Lvl 6" placeholder slot

**File:** `ProfilePage.tsx`  
**Problem:** Hardcoded empty slot in horse grid.  
**Fix:** Either derive from actual next-unlock logic (horses linked to milestones), or **remove** the placeholder slot until the unlock flow exists.  
**Recommendation:** Keep but make text dynamic based on user level, or remove.  
**Effort:** Trivial to remove; Small to make dynamic.

---

## Deferred (content / design decision)

### 5. Lesson content — same for all milestones

**File:** `LessonView.tsx` (DEFAULT_SECTIONS)  
**Problem:** Every milestone shows the same placeholder content.  
**Fix options:**  
  (a) Build a `lesson_sections` table with content per milestone.  
  (b) Keep content in code as a static map of `milestoneId → sections[]`.  
**DB change:** Option (a) needs a **new table**; option (b) needs no DB change.  
**Recommendation:** Start with (b) — a code-level map — since lesson content is authored, not user-generated. Migrate to DB later if content management is needed.  
**Effort:** Medium (writing actual content per milestone).

### 6. Lesson "Interactive Placeholder"

**File:** `LessonView.tsx` (DEFAULT_SECTIONS, "Try It Yourself" section)  
**Problem:** Static box where a drag-and-drop activity should be.  
**Verdict:** **Defer** — interactive activities are a feature unto themselves.  
**DB change:** None for now.

---

## DB changes summary

| Item | New table? | New column? | Notes |
|------|-----------|-------------|-------|
| Achievements (#1) | No | No | `badges` + `user_badges` exist |
| Notifications (#3) | **Yes** | — | Only if implemented; recommend removing bell for now |
| Lesson content (#5) | **Optional** | — | `lesson_sections` table only if content moves to DB |

**Bottom line:** The current DB schema covers achievements and lesson content (code-level map). No migrations needed except for optional lesson_sections or notifications.

---

## Suggested implementation order

1. **Remove or implement bell** — remove bell icon (#3) or add notifications later.
2. **Achievements page** — build real badges UI (#1).
3. **Profile "Next unlock"** — make dynamic or remove placeholder (#4).
4. **Lesson content** — per-milestone content map (#5).
