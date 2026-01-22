import api from "../api";

export interface Comment {
  id: number;
  author: string;
  authorId: string;
  authorPhoto?: string;
  content: string;
  date: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
  userId: number;
}

export const commentApi = {
  getComments: async (videoId: number): Promise<Comment[]> => {
    const response = await api.get(`/comments/video/${videoId}`);
    return response.data.data;
  },

  createComment: async (videoId: number, content: string, parentCommentId?: number): Promise<Comment> => {
    const response = await api.post(`/comments/video/${videoId}`, {
      content,
      parentCommentId,
    });
    return response.data.data;
  },

  deleteComment: async (videoId: number, commentId: number): Promise<void> => {
    await api.delete(`/comments/video/${videoId}/${commentId}`);
  },

  likeComment: async (commentId: number): Promise<{ liked: boolean }> => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data.data;
  },
};

