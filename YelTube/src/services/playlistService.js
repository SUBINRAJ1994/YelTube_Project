import API from "./api";

const transformPlaylist = (pl) => {
  if (!pl) return null;
  return {
    id: pl.id,
    name: pl.title,
    description: pl.description,
    isPrivate: pl.is_private,
    videos: (pl.videos || []).map((pv) => {
      if (!pv.video_details) return null;
      const v = pv.video_details;
      return {
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail || `https://picsum.photos/300/180?random=${v.id}`,
        videoUrl: v.video_file,
        channel: v.username || "YelTube Creator",
        views: v.views !== undefined ? `${v.views} views` : "0 views",
      };
    }).filter(Boolean),
  };
};

const playlistService = {
  getPlaylists: async () => {
    const response = await API.get("playlists/");
    return (response.data || []).map(transformPlaylist);
  },
  createPlaylist: async (title, description = "", isPrivate = false) => {
    const response = await API.post("playlists/", {
      title,
      description,
      is_private: isPrivate,
    });
    return transformPlaylist(response.data);
  },
  getPlaylistDetail: async (id) => {
    const response = await API.get(`playlists/${id}/`);
    return transformPlaylist(response.data);
  },
  updatePlaylist: async (id, title, description = "", isPrivate = false) => {
    const response = await API.patch(`playlists/${id}/`, {
      title,
      description,
      is_private: isPrivate,
    });
    return transformPlaylist(response.data);
  },
  deletePlaylist: async (id) => {
    const response = await API.delete(`playlists/${id}/`);
    return response.data;
  },
  addVideoToPlaylist: async (playlistId, videoId) => {
    const response = await API.post(`playlists/${playlistId}/add/`, {
      video_id: videoId,
    });
    return response.data;
  },
  removeVideoFromPlaylist: async (playlistId, videoId) => {
    const response = await API.delete(`playlists/${playlistId}/remove/${videoId}/`);
    return response.data;
  },
  getChannelPlaylists: async (username) => {
    const response = await API.get(`channel/${encodeURIComponent(username)}/playlists/`);
    return (response.data || []).map(transformPlaylist);
  },
};

export default playlistService;
