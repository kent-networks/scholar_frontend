import api from "@/lib/api";

export interface Video {
  id: number;
  title: string;
  description?: string;
  subject?: string;
  year?: number;
  institution?: string;
  videoUrl: string;
  imageUrls?: string[]; // Array of image URLs for image collections
  isImageCollection?: boolean; // True if this is an image collection
  thumbnailUrl?: string;
  poster?: string;
  videoType: "research-lab" | "scoop";
  views: number;
  likes: number;
  comments: number;
  date: string;
  author: string;
  authorId: string;
  authorUserId?: number;
  authorPhoto?: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface VideoListParams {
  type?: "research-lab" | "scoop";
  limit?: number;
  offset?: number;
  search?: string;
}

export const videoApi = {
  getVideos: async (params?: VideoListParams): Promise<Video[]> => {
    const response = await api.get("/videos", { params });
    return response.data.data;
  },

  getVideoById: async (id: number): Promise<Video> => {
    const response = await api.get(`/videos/${id}`);
    return response.data.data;
  },

  getUserVideos: async (userId: number): Promise<Video[]> => {
    const response = await api.get(`/videos/user/${userId}`);
    return response.data.data;
  },

  getUserLikedVideos: async (userId: number): Promise<Video[]> => {
    const response = await api.get(`/videos/user/${userId}/liked`);
    return response.data.data;
  },

  getUserSavedVideos: async (userId: number): Promise<Video[]> => {
    const response = await api.get(`/videos/user/${userId}/saved`);
    return response.data.data;
  },

  likeVideo: async (videoId: number) => {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data.data;
  },

  saveVideo: async (videoId: number) => {
    const response = await api.post(`/videos/${videoId}/save`);
    return response.data.data;
  },

  deleteVideo: async (videoId: number) => {
    await api.delete(`/videos/${videoId}`);
  },
};

