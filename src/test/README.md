# Testing Infrastructure

This directory contains the testing setup and utilities for the Tech PM Learn application.

## Setup

The project uses [Vitest](https://vitest.dev/) as the test runner, configured to work with React components and TypeScript.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `setup.ts` - Global test setup and configuration
- `utils.tsx` - Custom render function with providers (Router, etc.)
- `test-utils.ts` - Helper functions for creating mock data

## Writing Tests

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../../hooks/useQuiz';

test('should initialize correctly', () => {
  const { result } = renderHook(() => useQuiz({ questions: mockQuestions }));
  expect(result.current.currentQuestion).toBeDefined();
});
```

### Testing Components

```typescript
import { render, screen } from '../test/utils';
import { Button } from '../components/ui/Button';

test('should render button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## Test Utilities

### Mock Data Helpers

- `createMockQuestion()` - Creates a mock quiz question
- `createMockQuestions(count)` - Creates multiple mock questions
- `createMockHangmanWord()` - Creates a mock hangman word
- `createMockHangmanWords(count)` - Creates multiple mock hangman words

### Custom Render

The `render` function from `test/utils` automatically wraps components with necessary providers (Router, etc.).

## Coverage

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.
