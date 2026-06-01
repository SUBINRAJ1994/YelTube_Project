# YelTube Project Instructions

**Project**: YelTube - A YouTube-like video streaming platform  
**Tech Stack**: React 19.2 + Vite + Bootstrap 5.3  
**Backend**: Django API at `http://127.0.0.1:8000/api/`

---

## 🏛️ Architecture Overview

### Project Structure
```
src/
├── components/      # Reusable UI components (Header, Sidebar, VideoCard, etc.)
├── pages/          # Page-level components (Home, Watch, Shorts, Upload, etc.)
├── services/       # API integration (api.jsx with Axios)
├── hooks/          # Custom React hooks
├── context/        # React Context for state management
├── redux/          # Redux store (currently empty - not yet implemented)
├── layouts/        # Layout wrapper components
├── routes/         # Routing configuration
├── utils/          # Utility functions (includes ffmpeg.js for video processing)
├── data/           # Static data (shortsData.js, videos.js)
├── assets/         # Images, icons, static files
├── App.jsx         # Main app component with routing
└── main.jsx        # Entry point
```

### Key Design Patterns
1. **Component Structure**: Functional components with React hooks (useState, useEffect)
2. **Prop Drilling**: State managed at App.jsx level and passed down (currently no Redux)
3. **Authentication**: localStorage-based with `isLoggedIn` and `currentUser` keys
4. **API Communication**: Axios with centralized API instance (`services/api.jsx`)
5. **Styling**: CSS modules + Bootstrap for responsive design
6. **Routing**: React Router v7 with protected routes for authenticated pages

---

## 🚀 Build & Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint checks |
| `npm run preview` | Preview production build locally |

**Prerequisites**: Ensure Django backend is running on `http://127.0.0.1:8000/` before starting dev server.

---

## 📋 Code Conventions

### Naming Conventions
- **Components**: PascalCase (e.g., `VideoCard.jsx`, `Header.jsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`, `useVideo`)
- **Files**: Match component name or feature name (e.g., `components/VideoCard/` contains `VideoCard.jsx` + `VideoCard.css`)
- **CSS**: Separate CSS files per component (e.g., `VideoCard.jsx` + `VideoCard.css`)

### Component Pattern
```jsx
import "./ComponentName.css";
import { useState } from "react";

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### CSS Organization
- Use class-based selectors matching component name (e.g., `.header`, `.video-card`)
- Responsive design via Bootstrap utilities or media queries
- Mobile-first approach for responsive layouts

### Authentication Flow
```js
// Store user data
localStorage.setItem("currentUser", JSON.stringify(userData));
localStorage.setItem("isLoggedIn", "true");

// Retrieve user
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const isLoggedIn = localStorage.getItem("isLoggedIn");

// Logout
localStorage.removeItem("isLoggedIn");
localStorage.removeItem("currentUser");
window.location.reload();
```

---

## 🔌 API Integration

### Axios Setup (services/api.jsx)
```jsx
import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

export default API;
```

### Usage Pattern
```jsx
import API from "../services/api";

// Example GET request
const response = await API.get("/videos/");

// Example POST request with auth
const response = await API.post("/upload/", formData, {
  headers: { "Authorization": `Bearer ${token}` }
});
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.6 | UI framework |
| React DOM | 19.2.6 | React rendering |
| React Router DOM | 7.15.1 | Client-side routing |
| Axios | 1.16.1 | HTTP client |
| Bootstrap | 5.3.8 | CSS framework |
| React Icons | 5.6.0 | Icon library (FaHome, FaHistory, etc.) |
| FFmpeg | 0.12.15 | Video processing (browser-based) |
| Vite | 8.0.12 | Build tool & dev server |
| ESLint | 10.3.0 | Code linting |

---

## ⚠️ Important Constraints & Pitfalls

### 🚫 Critical: DO NOT Change Project Structure
The README explicitly states: **"dont change any file or folder structure in this projext"**
- Do not rename folders
- Do not move files between directories
- Do not delete any existing folders (even if empty like redux/)
- Do not restructure the src/ folder

### Common Pitfalls to Avoid
1. **Props Drilling**: Current implementation uses props extensively. Consider Context API or Redux for deeply nested state.
2. **Redux Not Set Up**: Redux folder is empty. If adding Redux, maintain the folder structure and don't change component organization.
3. **No Image/Asset Imports**: Verify all image paths use the correct relative paths and assets are in `src/assets/`.
4. **Backend Dependency**: App requires Django backend running on localhost:8000. Never hardcode different URLs in components.
5. **localStorage Usage**: Ensure consistent key names across components (`isLoggedIn`, `currentUser`).
6. **FFmpeg**: Heavy video processing may block UI. Consider Web Workers for video encoding.

---

## 🎯 Page & Component Reference

### Core Pages
- **Home** (`/`): Main video feed with categories and infinite scroll
- **Watch** (`/watch/:id`): Video player with comments and recommendations
- **Shorts** (`/shorts`): Short-form video feed
- **Upload** (`/upload`): Video upload page (protected route)
- **Login** (`/login`): Login page
- **Register** (`/register`): User registration
- **Channel** (`/channel/:id`): User channel page
- **Profile** (`/profile`): User profile (protected)
- **History** (`/history`): Watch history (protected)
- **WatchLater** (`/watchlater`): Watch later list
- **LikedVideos** (`/likedvideos`): Liked videos

### Core Components
- **Header**: Navigation bar with search, upload button, notifications, profile menu
- **Sidebar**: Navigation menu with links to Home, Shorts, History, Liked Videos, etc.
- **VideoCard**: Displays video thumbnail, title, channel, views, upload time
- **ShortsCard**: Display component for short-form videos
- **ProtectedRoute**: Wrapper component that checks authentication before rendering

---

## 🔑 Development Workflow

### When Adding Features:
1. **Identify the correct folder** - Components go in `components/`, pages in `pages/`
2. **Follow naming conventions** - PascalCase files, kebab-case CSS classes
3. **Create paired CSS file** - Each component should have its own CSS file
4. **Use existing patterns** - Follow existing component structure and API integration
5. **Maintain folder structure** - Never reorganize or move folders
6. **Test authentication** - If adding protected pages, use ProtectedRoute wrapper
7. **Verify API compatibility** - Ensure backend endpoints exist before implementing frontend

### When Debugging:
1. Check browser console for errors
2. Verify backend is running on port 8000
3. Check localStorage for auth tokens
4. Verify API endpoints in network tab
5. Use React DevTools to inspect component state

---

## 📝 Quick Reference

**React Version**: 19.2.6 (Latest)  
**Node Version**: Check package.json for compatibility  
**Package Manager**: npm  
**Default Port**: Vite dev server (typically 5173)  
**Backend URL**: http://127.0.0.1:8000/api/

---

## 🔗 Related Files
- Main entry: [src/main.jsx](../src/main.jsx)
- App routing: [src/App.jsx](../src/App.jsx)
- API setup: [src/services/api.jsx](../src/services/api.jsx)
- Protected routes: [src/components/ProtectedRoute/ProtectedRoute.jsx](../src/components/ProtectedRoute/ProtectedRoute.jsx)
