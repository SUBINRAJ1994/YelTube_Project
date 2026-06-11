import API from "./api";

const transformComment = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    author: c.username || "YelTube User",
    text: c.content,
    avatar: c.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.username || "YelTube")}&background=random&color=fff`,
    createdAt: c.created_at,
    user: c.user,
    video: c.video,
    replies: [],
  };
};

const commentService = {
  getComments: async (videoId) => {
    const response = await API.get(`comments/video/${videoId}/`);
    return (response.data || []).map(transformComment);
  },
  getCreatorComments: async () => {
    const response = await API.get("comments/creator/");
    return (response.data || []).map((c) => ({
      ...transformComment(c),
      videoTitle: c.video_title,
      videoId: c.video,
    }));
  },
  addComment: async (videoId, content) => {
    const response = await API.post("comments/add/", { video: videoId, content });
    return transformComment(response.data);
  },
  updateComment: async (id, content) => {
    const response = await API.put(`comments/${id}/`, { content });
    return transformComment(response.data);
  },
  deleteComment: async (id) => {
    const response = await API.delete(`comments/${id}/`);
    return response.data;
  },
};

export default commentService;
