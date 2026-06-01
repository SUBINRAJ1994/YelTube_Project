import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
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
import Short from "./pages/Shorts/Shorts";

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectCategory, setSelectCategory] = useState("All");
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
        setSelectCategory={setSelectCategory} />
      <Sidebar sidebar={sidebar} />

      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} selectCategory={selectCategory} sidebar={sidebar} />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
        <Route path="/watchlater" element={<WatchLater />} />
        <Route path="/likedvideos" element={<LikedVideos />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/short" element={<Short />} />
      </Routes>
    </Router>
  );
};

export default App;