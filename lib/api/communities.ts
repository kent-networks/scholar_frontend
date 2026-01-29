import api from "@/lib/api";

export interface Community {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  owner?: string;
  ownerId?: number;
  userRole?: "owner" | "admin" | "member";
  category?: string;
  isMember?: boolean;
  isActive?: boolean;
  lastActive?: string;
  createdAt?: string;
  notificationCount?: number;
  institutionName?: string | null;
  institutionId?: number | null;
  joinCode?: string | null;
  requireJoinCode?: boolean;
}

export interface CreateCommunityData {
  name: string;
  description?: string;
  researchField?: string;
  privacy?: "public" | "private";
  restrictInvitations?: boolean;
  moderateContent?: boolean;
  joinCode?: string;
}

export interface CommunityMember {
  id: number;
  userId: number;
  name: string;
  username: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
  photo?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const communityApi = {
  getCommunities: async (params?: { search?: string; limit?: number; offset?: number; filter?: 'all' | 'discover' | 'joined' | 'created' }): Promise<PaginatedResponse<Community>> => {
    const response = await api.get("/communities", { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getCommunityById: async (id: number): Promise<Community> => {
    const response = await api.get(`/communities/${id}`);
    return response.data.data;
  },

  getCommunityMembers: async (id: number, params?: { limit?: number; offset?: number }): Promise<PaginatedResponse<CommunityMember>> => {
    const response = await api.get(`/communities/${id}/members`, { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  createCommunity: async (data: CreateCommunityData) => {
    const response = await api.post("/communities", data);
    return response.data.data;
  },

  updateCommunity: async (id: number, data: Partial<CreateCommunityData>) => {
    const response = await api.put(`/communities/${id}`, data);
    return response.data;
  },

  deleteCommunity: async (id: number) => {
    const response = await api.delete(`/communities/${id}`);
    return response.data;
  },

  joinCommunity: async (communityId: number) => {
    const response = await api.post(`/communities/${communityId}/join`, {});
    return response.data;
  },

  joinCommunityWithCode: async (communityId: number, code: string) => {
    const response = await api.post(`/communities/${communityId}/join`, { code });
    return response.data;
  },

  leaveCommunity: async (communityId: number) => {
    const response = await api.post(`/communities/${communityId}/leave`);
    return response.data;
  },

  removeMember: async (communityId: number, memberId: number) => {
    const response = await api.delete(`/communities/${communityId}/members/${memberId}`);
    return response.data;
  },

  getCommunityPosts: async (communityId: number, params?: { limit?: number; offset?: number }) => {
    const response = await api.get(`/communities/${communityId}/posts`, { params });
    return response.data.data;
  },

  createCommunityPost: async (communityId: number, content: string) => {
    const response = await api.post(`/communities/${communityId}/posts`, { content });
    return response.data.data;
  },

  likeCommunityPost: async (postId: number) => {
    const response = await api.post(`/communities/posts/${postId}/like`);
    return response.data.data;
  },

  unlikeCommunityPost: async (postId: number) => {
    const response = await api.delete(`/communities/posts/${postId}/like`);
    return response.data.data;
  },

  getCommunityComments: async (postId: number, params?: { limit?: number; offset?: number }) => {
    const response = await api.get(`/communities/posts/${postId}/comments`, { params });
    return response.data.data;
  },

  createCommunityComment: async (postId: number, content: string) => {
    const response = await api.post(`/communities/posts/${postId}/comments`, { content });
    return response.data.data;
  },

  deleteCommunityComment: async (commentId: number) => {
    const response = await api.delete(`/communities/comments/${commentId}`);
    return response.data;
  },

  likeCommunityComment: async (commentId: number) => {
    const response = await api.post(`/communities/comments/${commentId}/like`);
    return response.data.data;
  },

  unlikeCommunityComment: async (commentId: number) => {
    const response = await api.delete(`/communities/comments/${commentId}/like`);
    return response.data.data;
  },

  getFiles: async (communityId: number, params?: { limit?: number; offset?: number }) => {
    const response = await api.get(`/communities/${communityId}/files`, { params });
    return response.data.data;
  },

  uploadFile: async (communityId: number, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/communities/${communityId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data.data;
  },

  deleteFile: async (fileId: number) => {
    const response = await api.delete(`/communities/files/${fileId}`);
    return response.data;
  },
};

