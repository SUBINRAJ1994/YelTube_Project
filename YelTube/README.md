dont change any file or folder structure in this projext   
Folder Structure
src/
│
├── assets/
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── VideoCard/
│   ├── ShortsCard/
│   ├── Comment/
│   └── Loader/
│
├── pages/
│   ├── Home/
│   ├── Watch/
│   ├── Shorts/
│   ├── Upload/
│   ├── Login/
│   ├── Register/
│   ├── Search/
│   ├── Channel/
│   └── Profile/
│
├── layouts/
├── routes/
├── services/
├── context/
├── redux/
├── hooks/
├── utils/
├── App.jsx
└── main.jsx

First UI Components to Build
Build in this order:
A. Header/Navbar
Features:

Logo
Search bar
Mic button
Upload button
Notification icon
Profile image
Mobile menu

Example:
[☰] YelTube     [ Search.......... ] 🔍 🎤   ⬆ 🔔 👤

B. Sidebar
Features:

Home
Shorts
Subscriptions
You
History
Liked videos
Trending
Gaming
Music

Sidebar should:

Expand/collapse
Responsive
Fixed position

C. Home Page

Main video feed.

Features:

Video cards grid
Infinite scroll
Categories
Recommended videos
D. Video Card Component

Each card contains:

Thumbnail
Title
Channel name
Views
Upload time
Duration

Example layout:
┌──────────────┐
│ Thumbnail    │
└──────────────┘
Title
Channel
1M views • 2 days ago

E. Watch Page

Most important page.

Features:

Video player
Like button
Subscribe button
Comments
Suggested videos

Layout:

VIDEO PLAYER
Title
Like Share Subscribe

Comments

Recommended Videos

F. Shorts/Reels Page

TikTok-like vertical videos.

Features:
Full-screen videos
Swipe scrolling
Auto-play
Like/comment/share overlay

React Router Setup

Example routes:
<Route path="/" element={<Home />} />
<Route path="/watch/:id" element={<Watch />} />
<Route path="/shorts" element={<Shorts />} />
<Route path="/upload" element={<Upload />} />
<Route path="/login" element={<Login />} />
<Route path="/channel/:id" element={<Channel />} />
Important React Components
| Component    | Purpose         |
| ------------ | --------------- |
| Header       | Top navbar      |
| Sidebar      | Navigation      |
| VideoCard    | Home videos     |
| VideoPlayer  | Watch page      |
| CommentBox   | Comments        |
| ShortsPlayer | Reels           |
| Loader       | Loading spinner |
| SearchBar    | Search          |
| ChannelCard  | Creator profile |

UI Design Plan
Theme

Modern dark theme like:

YouTube
Netflix

Recommended:
Background: #0f0f0f
Cards: #1f1f1f
Text: white
Accent: red

State Management Plan

Initially:

Use Context API

Later:

Use Redux Toolkit

Store:

User login
Theme
Video data
Likes
Notifications
Sidebar state

API Integration Structure
src/services/api.js
Example:

import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export default API;


First Frontend Milestone

✔ Header
✔ Sidebar
✔ Home page
✔ Video cards
✔ Watch page
✔ React Router
✔ Responsive design

Second Milestone
add
✔ Login/Register UI
✔ Upload page
✔ Comments UI
✔ Channel page
✔ Search page
✔ Shorts page

Third Milestone
Add advanced features:

✔ Infinite scrolling
✔ Video player controls
✔ Theme toggle
✔ Notifications
✔ Skeleton loading
✔ Responsive mobile UI

Recommended UI Order
1. Navbar
2. Sidebar
3. Home page
4. Video cards
5. Watch page
6. Shorts page
7. Upload page
8. Login/Register
9. Search
10. Channel page

Suggested Responsive Layout

Desktop:

Sidebar | Main Content

Mobile:

Top Navbar
Main Content
Bottom Navigation

Suggested Future Features

After frontend MVP:

Live streaming UI
AI recommendations
Voice search
Video editing tools
Creator analytics
Chat system

Final Frontend MVP
Your frontend should support:
✔ Responsive UI
✔ Video feed
✔ Watch page
✔ Shorts
✔ Search
✔ Authentication UI
✔ Upload UI
✔ Channel UI
✔ Comments UI


Recommended First Week Goal

Navbar + Sidebar
✔ Navbar/Header
✔ Sidebar
✔ Responsive Layout
✔ Sidebar Toggle
✔ Icons

Home page + Video cards
✔ Home page layout
✔ Video cards grid
✔ Responsive grid
✔ Skeleton loading
✔ Infinite scroll
✔ API data fetching


Current Working Progress (2026-05-20)

- **Completed:** Header/Navbar, Sidebar, Home page, Video cards, Watch page, React Router, Responsive design, Login/Register UI, Upload UI (frontend), Comments UI, Channel page, Search page, Shorts page, installed `@ffmpeg/util`.
- **In progress:** Upload backend integration, video processing pipeline (`src/utils/ffmpeg.js`), connecting `src/services/api.jsx` to backend endpoints, improving infinite-scroll performance.
- **Next steps:** finish upload backend hookup, test ffmpeg processing end-to-end, add basic unit/integration tests, polish mobile UI and edge-case handling.


src Files Working Progress

- `src/App.jsx`: completed — app shell and routing wired.
- `src/main.jsx`: completed — app mount and global imports.
- `src/index.css`: completed — base theme and responsive utilities.
- `src/components/Header/Header.jsx`: completed — search, upload, profile UI.
- `src/components/Header/Header.css`: completed.
- `src/components/Sidebar/Sidebar.jsx`: completed — navigation and responsive toggle.
- `src/components/Sidebar/Sidebar.css`: completed.
- `src/components/VideoCard/VideoCard.jsx`: completed — card layout and metadata.
- `src/components/VideoCard/VideoCard.css`: completed.
- `src/components/ShortsCard/`: in progress — component scaffolded, styling pending.
- `src/components/Loader/`: completed — skeleton loaders implemented.
- `src/pages/Upload/Upload.jsx`: frontend completed; backend integration in progress.
- `src/pages/Watch/Watch.jsx`: completed — player and sidebar suggestions implemented.
- `src/services/api.jsx`: in progress — axios instance present, endpoints wiring pending.
- `src/utils/ffmpeg.js`: in progress — ffmpeg pipeline being implemented; `@ffmpeg/util` installed.
- `src/data/videos.js`: completed — sample dataset for dev.
- `src/hooks/`: partial — some hooks added, more needed for uploads and pagination.

Update performed: 2026-05-20 — added per-file status for the `src` folder.



