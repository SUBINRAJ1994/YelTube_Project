import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home/Home";
import Watch from "./pages/Watch/Watch";
import Shorts from "./pages/Shorts/Shorts";
import Upload from "./pages/Upload/Upload";
import Login from "./pages/Login/Login";
import Channel from "./pages/Channel/Channel";
import Register from "./pages/Register/Register";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import History from "./pages/History/History";
import WatchLater from "./pages/WatchLater/WatchLater";
import LikedVideos from "./pages/LikedVideos/LikedVideos";
import Profile from "./pages/Profile/Profile";
import WatchHistory from "./pages/WatchHistory/WatchHistory";
import Playlists from "./pages/Playlists/Playlists";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import PlaylistsDetails from "./pages/PlaylistsDetails/PlaylistsDetails";
import LiveStream from "./pages/LiveStream/LiveStream";
import Admin from "./pages/Admin/Admin";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminVideos from "./pages/Admin/AdminVideos";
import AdminReports from "./pages/Admin/AdminReports";
import Studio from "./pages/Studio/Studio";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import Community from "./pages/Community/Community";
import Trending from "./pages/Trending/Trending";
import Explore from "./pages/Explore/Explore";
import Premium from "./pages/Premium/Premium";

const App = () => {
  const [sidebar, setSidebar] = useState(window.innerWidth > 1024);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectCategory, setSelectCategory] = useState("All");
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.className = `${theme} ${sidebar ? "" : "sidebar-collapsed"}`;
  }, [theme, sidebar]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebar(false);
      } else {
        setSidebar(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  return (
    <Router>
      <Header 
        toggleSidebar={toggleSidebar} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        selectCategory={selectCategory}
        setSelectCategory={setSelectCategory}
        theme={theme}
        setTheme={setTheme} />
      <Sidebar sidebar={sidebar} />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} selectedCategory={selectCategory} sidebar={sidebar} />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/channel" element={<Channel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/watchlater" element={<WatchLater />} />
        <Route path="/likedvideos" element={<LikedVideos />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/watchhistory" element={<WatchHistory />} />
        <Route path="/playlists/" element={<Playlists />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/playlists/:id" element={<PlaylistsDetails />} />
        <Route path="/livestream" element={<LiveStream />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<ProtectedRoute><AdminVideos /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings theme={theme} setTheme={setTheme} /></ProtectedRoute>} />
        <Route path="/community" element={<Community />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </Router>
  );
};

export default App;