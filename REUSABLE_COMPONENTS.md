# Reusable Components Documentation

## Overview

This document catalogs all reusable components in the codebase, organized by category and usage.

## Component Categories

### 1. UI Components (`src/app/components/ui/`)

**Generic, theme-agnostic components**

#### ✅ Existing Components

| Component | Description | Usage |
|-----------|-------------|-------|
| `Button` | Styled button with variants (primary, secondary, outline, ghost, danger) | Used throughout app |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | Card container components | Dashboard, Profile, etc. |
| `ProgressBar` | Progress indicator with animation | Dashboard, Profile, Lessons |
| `Input`, `Textarea` | Form input fields | Forms |
| `Select`, `Checkbox`, `RadioGroup` | Form controls | Forms |
| `Dialog`, `AlertDialog` | Modal dialogs | Confirmation dialogs |
| `Tooltip`, `Popover` | Overlay components | Hover information |
| `Tabs`, `Accordion` | Layout components | Content organization |
| `Avatar`, `Badge` | Display components | Profile, achievements |
| `Table` | Data table | Data display |
| `Calendar` | Date picker | Date selection |
| `Pagination` | Page navigation | List pagination |
| `Sidebar` | Navigation sidebar | Layout navigation |

### 2. Dashboard Components (`src/app/components/dashboard/`)

**Dashboard-specific reusable components**

#### ✅ Newly Created

| Component | Props | Description | Usage |
|-----------|-------|-------------|-------|
| `StatsCard` | `icon`, `label`, `value`, `subtitle?`, `progress?` | Displays a stat with optional progress bar | Dashboard stats grid |
| `MilestoneCard` | `milestone`, `onClick?`, `showProgress?` | Displays a milestone with status styling | Dashboard, MilestoneMap |
| `WelcomeBanner` | `user`, `onContinueLearning?`, `onViewQuests?` | Welcome message with actions | Dashboard header |
| `ChoreItem` | `chore`, `onToggle?` | Daily chore list item with checkbox | Dashboard chores list |
| `LeaderboardItem` | `entry` | Leaderboard entry with rank highlighting | Dashboard leaderboard |

### 3. Quiz Components (`src/app/components/quiz/`)

**Quiz-specific reusable components**

#### ✅ Newly Created

| Component | Props | Description | Usage |
|-----------|-------|-------------|-------|
| `QuizResult` | `result`, `onReview?`, `onReturn?`, `reward?` | Quiz completion screen | QuizPage, QuizView |
| `QuizOption` | `option`, `index`, `question`, `isSelected`, `isAnswered`, `onClick` | Individual quiz option button | QuizPage, QuizView |
| `QuizExplanation` | `question`, `className?` | Explanation display after answer | QuizPage, QuizView |

### 4. Hangman Components (`src/app/components/hangman/`)

**Hangman game-specific reusable components**

#### ✅ Newly Created

| Component | Props | Description | Usage |
|-----------|-------|-------------|-------|
| `HangmanVisual` | `wrongGuesses`, `maxWrongGuesses?` | SVG hangman drawing | HangmanGame |
| `WordDisplay` | `word`, `revealedWord`, `hint?`, `showHint?` | Word reveal display | HangmanGame |
| `Keyboard` | `guessedLetters`, `onLetterClick`, `disabled?` | Letter keyboard | HangmanGame |
| `GameOverlay` | `gameStatus`, `word`, `onNext?`, `onQuit?` | Win/lose overlay | HangmanGame |

## Potential Reusable Components to Create

### High Priority

#### 1. `PageHeader`
**Purpose**: Standardized page header  
**Props**: `title`, `subtitle?`, `breadcrumbs?`, `actions?`  
**Usage**: All pages  
**Location**: `src/app/components/layout/PageHeader.tsx`

#### 2. `EmptyState`
**Purpose**: Empty state display  
**Props**: `icon?`, `title`, `description?`, `action?`  
**Usage**: Lists, search results  
**Location**: `src/app/components/ui/EmptyState.tsx`

#### 3. `LoadingSpinner`
**Purpose**: Loading indicator  
**Props**: `size?`, `fullScreen?`  
**Usage**: Data loading states  
**Location**: `src/app/components/ui/LoadingSpinner.tsx`

#### 4. `ErrorBoundary`
**Purpose**: Error handling wrapper  
**Props**: `children`, `fallback?`  
**Usage**: Wrap page components  
**Location**: `src/app/components/layout/ErrorBoundary.tsx`

#### 5. `ConfettiWrapper`
**Purpose**: Reusable confetti celebration  
**Props**: `show`, `onComplete?`  
**Usage**: Achievements, quiz completion  
**Location**: `src/app/components/ui/ConfettiWrapper.tsx`

#### 6. `ProgressIndicator`
**Purpose**: Linear progress with label  
**Props**: `value`, `max`, `label?`, `showPercentage?`  
**Usage**: Lesson progress, quiz progress  
**Location**: `src/app/components/ui/ProgressIndicator.tsx`

#### 7. `BadgeDisplay`
**Purpose**: Badge collection display  
**Props**: `badges`, `maxVisible?`, `onClick?`  
**Usage**: Profile, achievements  
**Location**: `src/app/components/ui/BadgeDisplay.tsx`

#### 8. `HorseCard`
**Purpose**: Horse display card  
**Props**: `horse`, `onClick?`  
**Usage**: Profile, stable view  
**Location**: `src/app/components/game/HorseCard.tsx`

### Medium Priority

#### 9. `SectionNavigation`
**Purpose**: Sidebar navigation for sections  
**Props**: `sections`, `currentIndex`, `onNavigate`  
**Usage**: LessonView  
**Location**: `src/app/components/lesson/SectionNavigation.tsx`

#### 10. `TooltipCard`
**Purpose**: Info card with icon  
**Props**: `icon`, `title`, `content`, `variant?`  
**Usage**: LessonView sidebar  
**Location**: `src/app/components/ui/TooltipCard.tsx`

#### 11. `MilestoneMapNode`
**Purpose**: Map node component  
**Props**: `milestone`, `position`, `onClick?`  
**Usage**: MilestoneMap  
**Location**: `src/app/components/map/MilestoneMapNode.tsx`

#### 12. `FileUpload`
**Purpose**: File upload area  
**Props**: `onFileSelect`, `accept?`, `maxSize?`  
**Usage**: Forms (file upload flows)  
**Location**: `src/app/components/ui/FileUpload.tsx`

#### 13. `RewardCard`
**Purpose**: Reward display card  
**Props**: `reward`, `unlocked?`  
**Usage**: Quiz results, achievements  
**Location**: `src/app/components/game/RewardCard.tsx`

#### 14. `NotificationBell`
**Purpose**: Notification indicator  
**Props**: `count?`, `onClick?`  
**Usage**: Layout header  
**Location**: `src/app/components/layout/NotificationBell.tsx`

### Low Priority

#### 15. `AnimatedCounter`
**Purpose**: Number counter animation  
**Props**: `value`, `duration?`  
**Usage**: XP display, score display  
**Location**: `src/app/components/ui/AnimatedCounter.tsx`

#### 16. `StreakDisplay`
**Purpose**: Streak visualization  
**Props**: `streak`, `maxStreak?`  
**Usage**: Dashboard, Profile  
**Location**: `src/app/components/game/StreakDisplay.tsx`

#### 17. `LevelProgress`
**Purpose**: Level progress display  
**Props**: `level`, `xp`, `nextLevelXp`  
**Usage**: Dashboard, Profile  
**Location**: `src/app/components/game/LevelProgress.tsx`

#### 18. `AchievementBadge`
**Purpose**: Achievement badge component  
**Props**: `badge`, `unlocked?`, `onClick?`  
**Usage**: Profile, achievements page  
**Location**: `src/app/components/game/AchievementBadge.tsx`

## Component Usage Patterns

### Pattern 1: Data-Driven Components
```typescript
// Components receive data as props
<MilestoneCard milestone={milestone} onClick={handleClick} />
```

### Pattern 2: Service Layer Integration
```typescript
// Components use data service
const milestones = await dataService.getMilestones();
```

### Pattern 3: Hook Integration
```typescript
// Components use custom hooks
const { currentQuestion, selectOption, checkAnswer } = useQuiz({ questions });
```

## Migration Guide

### Updating Components to Use Data Layer

**Before:**
```typescript
const questions = [
  { id: 1, question: "...", ... }
];
```

**After:**
```typescript
import { dataService } from '../../../lib/services/data.service';

const [questions, setQuestions] = useState<Question[]>([]);

useEffect(() => {
  dataService.getQuestions('database').then(setQuestions);
}, []);
```

### Updating Components to Use Reusable Components

**Before:**
```typescript
<Card>
  <CardContent className="flex items-center gap-4">
    <div className="w-12 h-12 bg-[#FFD700]/20...">
      ⭐
    </div>
    <div>
      <p>Experience Points</p>
      <h3>{user.xp} XP</h3>
    </div>
  </CardContent>
</Card>
```

**After:**
```typescript
<StatsCard
  icon="⭐"
  label="Experience Points"
  value={`${user.xp} XP`}
  progress={{ value: user.xp, max: user.nextLevelXp }}
/>
```

## Best Practices

1. **Always use data service** - Never hardcode data in components
2. **Extract repeated patterns** - If used 2+ times, make it a component
3. **Keep components focused** - One responsibility per component
4. **Use TypeScript** - Proper typing for all props
5. **Document props** - JSDoc comments for complex components
6. **Test components** - Unit tests for reusable components
