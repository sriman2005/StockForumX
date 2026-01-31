# Frontend Guide

[← Back to Documentation Index](../README.md)

## Overview

The frontend is built with **React 18** and **Vite**, featuring a modern, responsive UI with real-time capabilities.

## Project Structure

```text
client/src/
├── components/          # Reusable components
├── pages/              # Route pages
├── context/            # React Context
├── services/           # API layer
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

## Key Components

### Common Components

- **Navbar**: Main navigation with auth state.
- **Loader**: Global loading spinner.
- **ErrorBoundary**: Catches rendering errors.
- **EmptyState**: Standard "Notification" for empty lists.

### Feature Components

> [!TIP]
> Components are organized by feature domain (questions, predictions, profile) for better maintainability.

- **QuestionList**: Displays list of questions with filtering.
- **AskQuestionModal**: Form for posting questions.
- **PredictionForm**: Handles price and direction predictions.

## Context Providers

### AuthContext

Manages user session and authentication.

**Usage:**

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
    const { user, login } = useAuth();
    // ...
}
```

### SocketContext

Manages the persistent WebSocket connection.

**Usage:**

```javascript
import { useSocket } from '../context/SocketContext';

function Chat() {
    const socket = useSocket();
    // ...
}
```

## Services

### API Service (`services/api.js`)

Centralized Axios instance for HTTP requests.

```javascript
import { getStocks } from '../services/api';

const fetchStocks = async () => {
    const { data } = await getStocks();
    setStocks(data.stocks);
};
```

## Styling

We use **CSS Modules** concept (file-per-component) and global variables in `index.css`.

**Variables:**
- `--primary`: #3b82f6
- `--bg-primary`: #0f172a
- `--text-primary`: #f1f5f9

## State Management

1.  **Local State**: `useState` for component UI state.
2.  **Global State**: `useContext` for Auth and Socket.
3.  **Server State**: Managed via `useEffect` and API calls (consider React Query for future).

## Performance Tips

> [!NOTE]
> Performance is key for a real-time app.

1.  **Code Splitting**: Routes are lazy-loaded.
2.  **Virtualization**: `react-window` used for long stock lists.
3.  **Memoization**: `React.memo` and `useMemo` prevents unnecessary re-renders.
