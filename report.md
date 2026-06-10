# YelTube — Detailed A-to-Z Project Report

This document contains a comprehensive analysis, architectural breakdown, directory layout, and file-by-file operational report of the **YelTube** video-sharing application.

---

## 📂 Project Folder Structure

The YelTube project is structured as a client-side React single-page application (SPA) scaffolded with Vite. Styling is written using custom Vanilla CSS (supporting dark/light theme systems) with icons provided by `react-icons` (primarily Font Awesome).

```
YelTube/
├── .github/                      # GitHub configuration directories
├── .gitignore                    # Git ignored files and directories
├── README.md                     # General onboarding documentation
├── eslint.config.js              # ESLint rules and settings
├── index.html                    # Root HTML file and application mountpoint
├── package.json                  # Dependencies, scripts, and project metadata
├── package-lock.json             # Locked dependency tree resolution
├── public/                       # Static assets served as-is (icons, fallback assets)
├── src/                          # Main React source files
│   ├── App.jsx                   # Application routing and global state shell
│   ├── index.css                 # Global styling, design system, theme variables
│   ├── main.jsx                  # Main entry point mounting React to the DOM
│   ├── assets/                   # Static images and media files
│   ├── components/               # Reusable UI components
│   │   ├── Categories/           # Horizontal filtering scrollbar
│   │   │   ├── Categories.css
│   │   │   └── Categories.jsx
│   │   ├── Header/               # Top navigation bar and user menus
│   │   │   ├── Header.css
│   │   │   └── Header.jsx
│   │   ├── ProtectedRoute/       # Authentication route gate wrapper
│   │   │   └── ProtectedRoute.jsx
│   │   ├── ShareModal/           # Social media sharing clipboard dialog
│   │   │   ├── ShareModal.css
│   │   │   └── ShareModal.jsx
│   │   ├── Sidebar/              # Left navigation panel (collapsible)
│   │   │   ├── Sidebar.css
│   │   │   └── Sidebar.jsx
│   │   └── VideoCard/            # Standardized video grid cards
│   │       ├── VideoCard.css
│   │       └── VideoCard.jsx
│   ├── context/                  # Context APIs (folders preserved for expansion)
│   ├── data/                     # Mock content database seeds
│   │   ├── shortsData.js         # Initial seed data for Shorts
│   │   └── videos.js             # Initial seed data for Videos
│   ├── hooks/                    # Reusable custom React hooks
│   ├── pages/                    # Major page-level routing templates
│   │   ├── Admin/                # Moderator and platform control console
│   │   │   ├── Admin.css
│   │   │   ├── Admin.jsx         # Admin dashboard summary stats
│   │   │   ├── AdminReports.jsx  # Reported content queue
│   │   │   ├── AdminUsers.jsx    # User activation/suspension control
│   │   │   └── AdminVideos.jsx   # Upload review queue
│   │   ├── Channel/              # Creator homepage template
│   │   ├── Community/            # Texts and polls sharing feed
│   │   ├── Explore/              # Discover topics and portal channels
│   │   ├── History/              # User navigation history
│   │   ├── Home/                 # Core video feed homepage
│   │   ├── LikedVideos/          # Saved videos liked list
│   │   ├── LiveStream/           # Real-time streaming player and Super Chat
│   │   │   ├── LiveStream.css
│   │   │   └── LiveStream.jsx
│   │   ├── Login/                # Account authorization forms
│   │   ├── Notifications/        # Platform alert feed page
│   │   ├── Playlists/            # Saved library folders
│   │   ├── PlaylistsDetails/     # Playlist media list editor
│   │   ├── Premium/              # Subscription upgrades portal
│   │   ├── Profile/              # Account customization page
│   │   ├── Register/             # Account creation forms
│   │   ├── Search/               # Query query details feed
│   │   ├── Settings/             # Global options page
│   │   ├── Shorts/               # TikTok-like immersive short player
│   │   │   ├── Shorts.css
│   │   │   └── Shorts.jsx
│   │   ├── Studio/               # Creator workspace dashboard
│   │   ├── Subscriptions/        # Subscribed creator upload feeds
│   │   ├── Trending/             # Hot uploads sorted feeds
│   │   ├── Upload/               # Multi-stage AI Moderation upload screen
│   │   │   ├── Upload.css
│   │   │   └── Upload.jsx
│   │   ├── Watch/                # Primary video player and interactive comment hub
│   │   │   ├── Watch.css
│   │   │   └── Watch.jsx
│   │   ├── WatchHistory/         # User watch timelines
│   │   └── WatchLater/           # Bookmarked videos list
│   └── services/                 # External service interfaces
│       └── api.jsx               # Axios API configuration
```

---

## ⚙️ Configuration & Project Dependencies

The project settings are declared across config files at the root level:

### 1. [package.json](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/package.json)
* **Scripts**:
  * `npm run dev`: Boots the Vite development server on port `5174` locally.
  * `npm run build`: Generates optimized static HTML/CSS/JS production assets.
* **Core Dependencies**:
  * `react` and `react-dom` (v19): Modern React engine.
  * `react-router-dom` (v7): Declares the application routes and context mapping.
  * `axios` (v1): Configured for potential server-side requests.
  * `react-icons` (v5): Centralized font icon repository.
  * `@ffmpeg/ffmpeg` & `@ffmpeg/util` (v0.12): WebAssembly binaries for client-side frame processing and audio extraction.
  * `bootstrap` (v5): Legacy layout resets and components.

### 2. [vite.config.js](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/vite.config.js)
* Exports standard Vite configuration utilizing the `@vitejs/plugin-react` plugin for React compilation and Hot Module Replacement (HMR).

---

## 🎨 Design System & Theme Layout

Global designs are styled inside [index.css](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/index.css), introducing custom CSS variables toggleable via the HTML body's `.light` and `.dark` state classes:

| Token Variable | Light Mode Value | Dark Mode Value |
| :--- | :--- | :--- |
| `--bg-color` | `#f9f9f9` (Light gray) | `#0f0f0f` (Pure dark) |
| `--text-color` | `#0f0f0f` (Near black) | `#f1f1f1` (Off white) |
| `--card-bg` | `#ffffff` (White) | `#0f0f0f` (Pure dark) |
| `--hover-bg` | `#f2f2f2` (Light hover) | `#272727` (Dark grey) |
| `--border-color` | `#cccccc` (Gray border) | `#3f3f3f` (Dark border) |
| `--header-bg` | `#ffffff` | `#0f0f0f` |
| `--sidebar-bg` | `#ffffff` | `#0f0f0f` |
| `--dropdown-bg` | `#ffffff` | `#212121` (Premium grey) |
| `--input-bg` | `#ffffff` | `#121212` |

### Collapsible Layout Structure
When the sidebar is toggled, a global state sets `document.body.className = "${theme} ${sidebar ? '' : 'sidebar-collapsed'}"`. Inside `index.css`, layout shifting utilizes smooth transitions:
```css
body.sidebar-collapsed .watch-page,
body.sidebar-collapsed .live-page,
... {
  margin-left: 0px !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
}
```
This forces all content grids to automatically resize and realign margins smoothly without breaking columns.

---

## 🔗 Root Application & Core Shell

### 1. [App.jsx](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/App.jsx)
Main routing hub which renders the standard layout wrap:
* **States**:
  * `sidebar` (boolean): Controls visibility state. Resolves dynamically to screen size (defaults to `false` if `window.innerWidth <= 1024` on load).
  * `searchQuery` (string): Tied to search input in Header.
  * `selectCategory` (string): Tied to Categories selector.
  * `theme` (string): Tracked via `localStorage` with a default of `"dark"`.
* **Routing Table**:
  * `/` ➔ Home page (passes filters and sidebar state).
  * `/watch/:id` ➔ Watch page player.
  * `/shorts` ➔ Shorts page loop viewer.
  * `/upload` ➔ Upload moderation page (Protected).
  * `/livestream` ➔ Live stream console.
  * `/admin`, `/admin/users`, `/admin/videos`, `/admin/reports` ➔ Admin Panel (Protected).
  * `/studio` ➔ Creator Studio dashboard.
  * `/notifications` ➔ Notifications Feed page (Protected).
  * `/settings` ➔ Settings preferences (Protected).

### 2. [Header.jsx](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/components/Header/Header.jsx)
* Displays company logo, Search bar (inputs queries), Create/Upload buttons, Alerts menu, and Profile icon.
* Features a customized user menu dropdown that displays user-specific routes (Profile, Channel, Settings, Admin Panel, Logout) using Font Awesome icons.

### 3. [Sidebar.jsx](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/components/Sidebar/Sidebar.jsx)
* A fixed vertical nav drawer dynamically adjusting widths based on `.sidebar-collapsed`.
* Houses portal options separated by separators: Home, Shorts, Subscriptions, Live, Playlists, History, Liked, Studio, Settings, and Admin.

---

## 📺 Detailed Page Operations

### 1. AI Content Moderation & Upload (`Upload.jsx`)
Features a custom content moderation loop simulating server-side analysis:
* **Pipeline Process**:
  1. **Upload Trigger**: Standard title, description, category, video file, and thumbnail selection.
  2. **Preprocessing (FFmpeg simulation)**: Progress bar moves through:
     * *Uploading files...* (0% - 20%)
     * *Keyframe extraction and audio isolating...* (20% - 40%)
     * *Speech-to-text transcript translation...* (40% - 60%)
     * *Language detection...* (60% - 80%)
     * *AI policy analysis...* (80% - 95%)
  3. **Auto Language Detector**: Checks character codes via RegExp tests to verify language encoding (Hindi, Malayalam, Tamil, Telugu, Kannada, Arabic, Chinese, Japanese, Korean, French, German, Spanish, English).
  4. **Policy Verification Engine**:
     * **Child Sexual Content**: Keywords trigger an immediate hard block with a `SEVERE_BAN` flag. Bans the account permanently by modifying `currentUser.banned = true` and blocking uploads.
     * **Pornography/Adult Content**: Matches text queries against sexually explicit strings. Sets status to `BLOCK`. If it's a first offense, pops up a policy violation warning modal which increments the user's warning count. If they have an existing warning, it initiates a permanent ban.
     * **CBFC Movie Exemption**: Videos containing review keywords ("cbfc certified", "official trailer") bypass graphic content filters, moving them to a manual review queue (`REVIEW`) instead of a block.
     * **Violence and Gore**: Gore keywords flag the video. If contextual tokens like "news reporting", "action movie", or "historical context" are matched, it overrides the block, allowing the upload. Otherwise, it blocks or queues the video for review.

### 2. Live Stream Module (`LiveStream.jsx`)
Simulates an active livestream panel:
* **Embedded Player**: Uses a YouTube video embed with custom overlay badges tracking simulated viewer numbers.
* **Live Chat Feed**: Simulates active users posting randomly in real time. Features colored badges and administrator stars.
* **Super Chat Integration**:
  * Five pricing tiers: $2 (Blue), $5 (Green), $10 (Yellow), $50 (Orange), $100 (Red).
  * Character limit restrictions vary by tier (higher tiers permit longer text).
  * Displays a gorgeous preview card and injects custom color highlight containers into the live chat feed.
  * Pinned Super Chat element remains locked at the top of the chat panel.
* **Actions Panel**: Like, Dislike, Share, and Super Chat action buttons styled as high-premium pills. Liked/Disliked states persist inside local storage.
* **Schedule Reminders**: Users can click "Notify Me" on upcoming streams. Reminders persist in localStorage and update button states dynamically.

### 3. Shorts Module (`Shorts.jsx`)
TikTok-like full-height screen portal:
* **Immersive Interface**: Renders HTML5 `<video>` tags that auto-play and loop on click.
* **Vertical Side Actions**: Uses icons (`FaHeart`, `FaHeartBroken`, `FaComment`, `FaClock`) representing Likes, Dislikes, Comments, and Save.
* **Comments Sliding Tray**: Slided-in glassmorphic tray allowing users to write, read, delete, and react to comments on individual shorts.
* **Media Record**: A rotating music vinyl disc in the corner displaying the creator's avatar.

### 4. Interactive Video Player (`Watch.jsx`)
Features a custom video player layout:
* **Custom Control Bar Overlay**:
  * Play / Pause, Progress Slider, Elapsed Time count.
  * Speaker icon with slider volume control.
  * Subtitles (CC) overlay switch.
  * Cog Settings dropdown: controls playback speed metrics (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x).
  * Fullscreen toggle.
* **Interactive Comments**: Users can write, reply, edit, delete, react to, and report comment entries.

### 5. Admin Console (`Admin.jsx` / `AdminUsers.jsx` / `AdminVideos.jsx` / `AdminReports.jsx`)
* **Stats Overview**: Shows total videos, registered users, and unresolved flag queues.
* **User Control**: Moderators can toggle ban status, lock channel creators, or remove users.
* **Video Control**: Review video processing states, verify flagged material, and delete videos.
* **Reports**: View and act on content flagged by users or auto-reported by the AI Moderation Engine.

---

## 💾 Local Storage Data Schema

YelTube is database-free, persisting state inside browser `localStorage`. Below are the primary keys:

1. `currentUser`: Current logged-in user object.
   * *Schema*: `{ name, email, avatar, banned, warnings, token }`
2. `users`: Array of registered user profile objects.
3. `uploadedVideos`: Videos uploaded through the moderation flow.
4. `likedVideos`: Array of video objects liked by the current user.
5. `watchLater`: Array of videos added to the user's Watch Later list.
6. `watchHistory`: List of watched videos, including playback progress percentages to resume playback.
7. `adminReports`: Reports generated by users or automatically flagged by the AI Moderation Engine.
8. `liveChat`: Message logs for the Live Stream.
9. `liveLiked` / `liveDisliked`: Liked/disliked states for the livestream page.
10. `liveSubscribed`: Subscription status for the streamer.
11. `streamFollowers`: Number of followers on the livestream.
12. `livePinnedMessage`: The currently pinned chat message.
13. `liveReminders`: Reminders set for scheduled streams.
14. `shortsData`: Array of Shorts videos containing comments, likes, and dislikes.

---

## 🛠️ Verification & Building

* Build outputs compile to the `/dist` directory.
* Run locally using `npm run dev` to preview the code live.
* Styles follow standard CSS specs to remain lightweight and prevent framework dependency overhead.
