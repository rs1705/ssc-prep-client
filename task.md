# Mental Maths Enhancements Task Checklist

## 1. Attempt History Tracking
- [ ] Import `useRef` in [useMentalMathsEngine.ts](file:///c:/Users/Home/Documents/ssc-app/main-app/client/hooks/useMentalMathsEngine.ts).
- [ ] Declare `questionStartTimeRef` in the `useMentalMathsEngine` hook.
- [ ] Add `useEffect` listening to `state.currentQuestion` and `state.status` to capture `Date.now()` as the start time.
- [ ] Update `submitUserAnswer` to compute `timeTaken` and pass it to dispatch `SUBMIT_ANSWER` with `userAnswer` and `timestamp`.
- [ ] Update `gameReducer`'s `SUBMIT_ANSWER` case to calculate `timeTaken`, build the `QuestionAttempt` object, and append it to `state.history`.
- [ ] Uncomment the scorecard review section in [page.tsx](file:///c:/Users/Home/Documents/ssc-app/main-app/client/app/SSC/maths/mental-maths/%5Btopic%5D/page.tsx#L667-L715) and wire it to `engine.state.history`.

## 2. Sliding Window (Duplicate Prevention)
- [ ] Define a sliding window array in `GameState` (to track the last 3-5 generated question identifiers/numbers).
- [ ] Update `generateQuestion` in [mathGenerator.ts](file:///c:/Users/Home/Documents/ssc-app/main-app/client/lib/mathGenerator.ts) to accept an exclusion list.
- [ ] Update question generation loop to retry if the generated number is in the exclusion list.
- [ ] Update `gameReducer` to slide the window state upon generating next questions.

## 3. Basic Arithmetic Operations
- [ ] Add helper generators for addition, subtraction, multiplication, and division scaling by difficulty inside [mathGenerator.ts](file:///c:/Users/Home/Documents/ssc-app/main-app/client/lib/mathGenerator.ts).
- [ ] Register new operations in the main `generateQuestion` switch-case.
