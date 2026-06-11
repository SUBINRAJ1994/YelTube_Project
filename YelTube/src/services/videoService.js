import API from "./api";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const sStr = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) {
    const mStr = m < 10 ? `0${m}` : `${m}`;
    return `${h}:${mStr}:${sStr}`;
  }
  return `${m}:${sStr}`;
};

const transformVideo = (video) => {
  if (!video) return null;
  if (video.channelLogo && video.videoUrl) return video;

  return {
    ...video,
    id: video.id,
    title: video.title,
    thumbnail: video.thumbnail || `https://picsum.photos/300/180?random=${video.id}`,
    videoUrl: video.video_file,
    channel: video.username || "YelTube Creator",
    channelLogo: video.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username || "YelTube")}&background=random&color=fff`,
    views: video.views !== undefined ? `${video.views} views` : "0 views",
    time: video.created_at ? formatRelativeTime(video.created_at) : "Just now",
    duration: video.duration ? formatDuration(video.duration) : "0:00",
  };
};

const videoService = {
  // Public video views
  getVideos: async () => {
    const response = await API.get("videos/");
    return (response.data || []).map(transformVideo);
  },
  getVideoDetail: async (id) => {
    const response = await API.get(`videos/${id}/`);
    return transformVideo(response.data);
  },
  getRelatedVideos: async (id) => {
    const response = await API.get(`videos/${id}/related/`);
    return (response.data || []).map(transformVideo);
  },
  searchVideos: async (query) => {
    const response = await API.get(`videos/search/?search=${encodeURIComponent(query)}`);
    return (response.data || []).map(transformVideo);
  },
  toggleReaction: async (id, reactionType) => {
    const response = await API.post(`videos/${id}/reaction/`, { reaction_type: reactionType });
    return response.data;
  },
  uploadVideo: async (formData) => {
    const response = await API.post("videos/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return transformVideo(response.data);
  },

  // Creator studio views
  getStudioVideos: async (page = 1, search = "") => {
    const response = await API.get(`studio/videos/?page=${page}&search=${encodeURIComponent(search)}`);
    if (response.data?.results) {
      return {
        ...response.data,
        results: response.data.results.map(transformVideo),
      };
    }
    return (response.data || []).map(transformVideo);
  },
  getStudioAnalytics: async () => {
    const response = await API.get("studio/analytics/");
    return response.data;
  },
  updateStudioVideo: async (id, formData) => {
    const response = await API.patch(`studio/video/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return transformVideo(response.data);
  },
  deleteStudioVideo: async (id) => {
    const response = await API.delete(`studio/video/${id}/`);
    return response.data;
  },
  updateStudioProfile: async (formData) => {
    const response = await API.patch("studio/profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Watch history logging
  getWatchHistory: async () => {
    const response = await API.get("history/");
    return (response.data || []).map((h) => ({
      ...h,
      video: transformVideo(h.video),
    }));
  },
  addToWatchHistory: async (videoId) => {
    const response = await API.post("history/add/", { video_id: videoId });
    return response.data;
  },
  removeFromWatchHistory: async (id) => {
    const response = await API.delete(`history/remove/${id}/`);
    return response.data;
  },
  clearWatchHistory: async () => {
    const response = await API.delete("history/clear/");
    return response.data;
  },

  // Watch later queue
  getWatchLater: async () => {
    const response = await API.get("watchlater/");
    return (response.data || []).map((wl) => ({
      ...wl,
      video: transformVideo(wl.video),
    }));
  },
  toggleWatchLater: async (videoId) => {
    const response = await API.post("watchlater/toggle/", { video_id: videoId });
    return response.data;
  },

  // Creator subscriptions
  getSubscriptions: async () => {
    const response = await API.get("subscriptions/");
    return response.data;
  },
  toggleSubscription: async (creatorId) => {
    const response = await API.post("subscriptions/toggle/", { channel_id: creatorId });
    return response.data;
  },
  getSubscriptionStatus: async (creatorId) => {
    const response = await API.get(`subscriptions/status/${creatorId}/`);
    return response.data;
  },
  getChannelVideos: async (username) => {
    const response = await API.get(`channel/${encodeURIComponent(username)}/videos/`);
    return (response.data || []).map(transformVideo);
  },
};

export default videoService;
