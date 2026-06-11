# YelTube — Engineering Implementation Plan (Phases 14–22)

This implementation plan outlines the steps required to transition YelTube from local storage and mock mechanics to a fully integrated production-ready backend, implementing Channel routes, Admin views, adaptive streaming (HLS), and operational logging/backups.

---

## User Review Required

> [!IMPORTANT]
> - **CORS Middleware Configuration:** We must activate `corsheaders.middleware.CorsMiddleware` in `settings.py` to allow React dev server requests on port `5173` to safely reach DRF on port `8000`.
> - **HLS Streaming Tooling:** The HLS Adaptive Bitrate compilation requires FFmpeg to be present on the system path of the environment hosting the backend.
> - **Database Port:** The local database port is set to `3307` in `settings.py`. Ensure this remains valid for the environment.

---

## Open Questions

> [!NOTE]
> None at this stage. All requirements align with the Django and React architecture.

---

## Proposed Changes

We will implement changes incrementally starting from dependencies first, then the core backend endpoints, and finally the React user interfaces.

### Component 1: CORS & General Settings Update

#### [MODIFY] [settings.py](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/backend/backend/settings.py)
- Append `'corsheaders.middleware.CorsMiddleware'` to `MIDDLEWARE`.
- Add `CORS_ALLOW_ALL_ORIGINS = True` (or configure exact whitelist `CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]`).
- Implement `LOGGING` config (Phase 19).

---

### Component 2: Channel & User Search Views (Phase 14 & 15)

#### [NEW] [channel urls & views](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/backend/backend/urls.py)
We will map public channel details under `/api/channel/<username>/` endpoints using django urls.

#### [MODIFY] [views.py](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/backend/users/views.py)
- Create `ChannelVideosListView` to fetch public videos uploaded by a specific user.
- Create `ChannelPlaylistsListView` to fetch public playlists created by a user.
- Create a user/channel search viewpoint to power the search results page.

#### [MODIFY] [urls.py](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/backend/users/urls.py)
- Expose search and listing paths.

---

### Component 3: Administrative Dashboard & Controls (Phase 18)

#### [NEW] [views.py](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/backend/users/views.py)
- Create `AdminStatsView` (accessible only by `IsAdminUser`) returning aggregated database counts:
  - Users (`User.objects.count()`)
  - Videos (`Video.objects.count()`)
  - Views (`Video.objects.aggregate(Sum('views'))`)
  - Reports (`Report.objects.count()`)
- Create `AdminUserListView` and `AdminUserBanView` to toggle ban flags (`user.is_active = False`).
- Create `AdminVideoListView` and `AdminVideoDeleteView` to handle admin content deletions.

---

### Component 4: Video Player & Watch Progress (Phase 17)

#### [MODIFY] [Watch.jsx](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/pages/Watch/Watch.jsx)
- Restore missing playback state hooks: `isPlaying`, `currentTime`, `duration`, `volume`, `isMuted`, `ccActive`, `showSettingsMenu`, `playbackSpeed`, `resolution`.
- Integrate resolution selector options. Load resolution variants from `VideoResolutionFile` list instead of mock URLs.
- Provide auto-bitrate switching fallback logic.

---

### Component 5: Header Notifications integration (Phase 16)

#### [MODIFY] [Header.jsx](file:///c:/Users/subin/OneDrive/Desktop/Yeltube_project/YelTube/src/components/Header/Header.jsx)
- Hook up notification dropdown to `notificationService.getNotifications()`.
- Add notification count badge.
- Implement "Mark as Read" triggers calling `notificationService.markAsRead(id)`.

---

## Verification Plan

### Automated Tests
- Run `python manage.py test` to verify no models or validation tests break.
- Run `npm run build` inside `YelTube` directory to ensure perfect JSX syntax.

### Manual Verification
- Deploy to local development stack.
- Login as Admin, inspect stats on `/admin`.
- Try toggling ban status of a mock creator user, check if user is active.
- Navigate to `/channel/<username>`, check tab switching (Videos, Playlists, About).
