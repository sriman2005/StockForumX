# Development Guide

[← Back to Documentation Index](../README.md)

## Getting Started

### Prerequisites

> [!IMPORTANT]
> Ensure you have the following installed before starting development.

- **Node.js**: v18+
- **MongoDB**: v6+
- **Git**

### Initial Setup

1.  **Clone and Install:**
    ```bash
    git clone <repo-url>
    cd StockForumX
    npm run install:all
    ```

2.  **Configure Environment:**
    ```bash
    cd server
    cp .env.example .env
    ```

3.  **Seed Database:**
    ```bash
    npm run seed
    ```

4.  **Start Development:**
    ```bash
    cd ..
    npm run dev
    ```

## Project Structure

### Frontend (`client/`)

The React application structure:

- `src/components/`: Reusable UI components.
- `src/pages/`: Main application routes.
- `src/context/`: React Context providers (Auth, Socket).
- `src/services/`: API integration layer.

### Backend (`server/`)

The Express application structure:

- `models/`: Mongoose schemas.
- `routes/`: API endpoint definitions.
- `controllers/`: Logic for routes (if separated).
- `sockets/`: Real-time event handlers.
- `jobs/`: Background cron jobs.

## Development Workflow

### 1. Feature Development

**Branch Strategy:**

```bash
git checkout -b feature/your-feature-name
```

**Cycle:**
1. Create/modify components.
2. Test locally.
3. Commit changes.
4. Push and create PR.

### 2. Adding a New Feature

#### Example: Add "Watchlist" Feature

**Step 1: Backend Model** (`server/models/Watchlist.js`)

```javascript
import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stock' }]
});

export default mongoose.model('Watchlist', watchlistSchema);
```

**Step 2: Backend Route** (`server/routes/watchlist.js`)
**Step 3: Frontend Service** (`client/src/services/api.js`)
**Step 4: Frontend Component** (`client/src/components/Watchlist.jsx`)

### 3. Code Style

> [!NOTE]
> Adhering to code style ensures consistency across the codebase.

#### JavaScript/React

- **Components**: `PascalCase` (e.g., `UserProfile.jsx`)
- **Functions**: `camelCase` (e.g., `getUserData`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

**Component Structure:**

```javascript
function MyComponent({ prop1 }) {
    // 1. Hooks
    const [state, setState] = useState(null);
    
    // 2. Effects
    useEffect(() => { ... }, []);
    
    // 3. Render
    return <div>...</div>;
}
```

### 4. Testing

**Manual Checklist:**
- [ ] Feature works as expected.
- [ ] Error handling is robust.
- [ ] Responsive design checks out.
- [ ] No console errors.

### 5. Debugging

> [!TIP]
> Use **React DevTools** for frontend state inspection and **PM2 logs** for backend monitoring.

**Console Logging:**

```javascript
console.log('User data:', user);
console.error('Error:', error);
```

### 6. Common Tasks

**Add New Route:**
1. Create route file in `server/routes/`.
2. Registers it in `server/index.js`.

**Add New Page:**
1. Create page in `client/src/pages/`.
2. Add route in `client/src/App.jsx`.

### 7. Performance Tips

- **Frontend**: Use `React.memo`, lazy loading, and debouncing.
- **Backend**: Add database indexes, use `.select()`, and implement caching.

## CI/CD Workflow

StockForumX uses **GitHub Actions**:

- **CI**: Validates code and builds frontend on every push.
- **CD**: Builds and publishes Docker images on tagging/release.
