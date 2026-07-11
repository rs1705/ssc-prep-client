# Implementation Plan - Mental Maths Enhancements

This plan outlines the design and changes to implement:
1. **Freestyle Question Mode (Completed)**: No timer, question limits (10, 20, 30), and correct lobby configurations (implemented by User).
2. **Attempt History Tracking**: Logging each question, user response, correct answer, and correct/wrong/skipped status, with a scrollable list view on the scorecard.
3. **Dynamic Progress Bar**: Fills up dynamically based on remaining time (timed mode) or completed questions (freestyle mode).
4. **Basic Arithmetic Operations**: Adding addition, subtraction, multiplication, and division to the math generator library.

---

## User Review Required

> [!IMPORTANT]
> - In **Freestyle mode**, the progress bar is based on the number of questions answered out of the total limit (e.g. `attempted / limit`).
> - In **Timed mode**, the progress bar is based on time remaining out of the total time limit (e.g. `remaining / limit`).
> - The history view will be displayed at the bottom of the scorecard as a list.

---

## Proposed Changes

### 1. Math Generator Library

#### [MODIFY] [mathGenerator.ts](file:///c:/Users/Home/Documents/ssc-app/main-app/client/lib/mathGenerator.ts)
- Implement functions for `addition`, `subtraction`, `multiplication`, and `division` with difficulty scaling:
  - **Addition**:
    - Easy: Numbers between 2 and 20.
    - Medium: Numbers between 10 and 100.
    - Hard: Numbers between 100 and 999.
  - **Subtraction**:
    - Easy: Numbers between 5 and 20, ensuring positive result.
    - Medium: Numbers between 20 and 100, ensuring positive result.
    - Hard: Numbers between 100 and 999, ensuring positive result.
  - **Multiplication**:
    - Easy: Tables 2 to 10.
    - Medium: Double digit tables 11 to 20.
    - Hard: Higher tables up to 30.
  - **Division**:
    - Scale by multiplying a divisor and a quotient (both integers) to ensure neat integer divisions.
- Register these operations in the main `generateQuestion` switch statement.

---

### 2. State Engine

#### [MODIFY] [useMentalMathsEngine.ts](file:///c:/Users/Home/Documents/ssc-app/main-app/client/hooks/useMentalMathsEngine.ts)
- Define `QuestionAttempt` type:
  ```typescript
  export interface QuestionAttempt {
      questionText: string;
      correctAnswer: number;
      userAnswer: number | "skip";
      status: "correct" | "wrong" | "skipped";
  }
  ```
- Add `history: QuestionAttempt[]` to `GameState` and initialize as `[]`.
- Update `GameAction` type:
  - Make `SUBMIT_ANSWER` accept `userAnswer: number | "skip"`.
- Update `gameReducer`:
  - In `START_COUNTDOWN`: reset `history` to `[]`.
  - In `SUBMIT_ANSWER`: append the attempt to `state.history`.
- Update `submitUserAnswer` in `useMentalMathsEngine`:
  - Pass the `userAnswer` value directly in the action payload.

---

### 3. Practice Page UI

#### [MODIFY] [page.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/app/SSC/maths/mental-maths/%5Btopic%5D/page.tsx)
- **Lobby View (Completed)**:
  - Update `handleModeChange` to support Timed/Freestyle limits.
  - Update the selector to correctly read and update `engine.state.questionLimit` using `handleQuestionLimitChange` when in freestyle mode (implemented by User).
- **Active Game View**:
  - Add a **Progress Bar** `<div className="w-full bg-muted h-2 rounded-full overflow-hidden">` at the top of the board.
  - Compute width based on mode:
    - Timed: `(timeRemaining / timeLimit) * 100`
    - Freestyle: `(attemptedQuestionsCount / questionLimit) * 100`
  - Style the bar with a smooth transition and display status text (e.g., `5 / 10 Qs` or `25s remaining`).
- **Scorecard View**:
  - Below the metrics grid, render a scrollable `<div className="w-full max-h-48 overflow-y-auto pr-1 flex flex-col gap-2 mt-4">` displaying all `QuestionAttempt` records.
  - Each item displays:
    - The math problem.
    - The user's answer (marked red if incorrect, green if correct, gray if skipped).
    - The correct answer (if wrong/skipped).
    - Visual indicators (check, cross, or skip icons).

---

## Verification Plan

### Manual Verification
- Test timed mode setup and ensure progress bar decreases smoothly in time with the countdown.
- Test freestyle mode setup, verifying that answering/skipping 10 questions ends the game, increases the progress bar in chunks, and does not trigger any timers.
- Test the scorecard page, ensuring the scrollable details list correct answers, incorrect answers, and skips accurately.
- Verify arithmetic generation (addition, subtraction, etc.) displays valid questions in easy, medium, and hard ranges.
