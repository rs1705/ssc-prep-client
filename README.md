# SSC Prep - Frontend

Frontend application for **SSC Prep**, a flashcard-based learning platform designed to help SSC aspirants improve vocabulary retention through personalized revision and interactive study modes.

## Tech Stack

- Next.js
- React
- TypeScript
- Redux Toolkit
- RTK Query
- Tailwind CSS
- ShadCN UI
- Firebase Authentication

---

## Features

- Secure user authentication
- Personalized flashcard study sessions
- Modified Leitner learning mode
- Freestyle learning mode
- Advanced flashcard filtering
- Bookmark management
- Responsive user interface
- Keyboard-friendly navigation
- API integration with backend services

---

## Project Structure

```
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── redux/
├── services/
├── types/
└── utils/
```

---

## State Management

Redux Toolkit is used for global application state.

RTK Query is used for:

- API requests
- Automatic caching
- Cache invalidation
- Loading states
- Error handling

---

## User Features

- Browse flashcards
- Search flashcards
- Filter by subject
- Filter by exam
- Filter by year
- Filter by difficulty
- Bookmark flashcards
- Personalized revision sessions

---

## Backend Communication

The frontend communicates with the backend through REST APIs.

Examples include:

- Authentication
- Flashcard retrieval
- Bookmarks
- Learning progress
- User statistics

---

## Running Locally

```bash
npm install
npm run dev
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Future Improvements

- Dark mode
- Offline support
- AI-powered recommendations
- Mobile application
- Progressive Web App
