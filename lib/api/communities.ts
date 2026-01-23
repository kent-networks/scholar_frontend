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
  isActive?: boolean;
  lastActive?: string;
  createdAt?: string;
}

export interface CreateCommunityData {
  name: string;
  description?: string;
  researchField?: string;
  privacy?: "public" | "private";
  restrictInvitations?: boolean;
  moderateContent?: boolean;
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
  getCommunities: async (params?: { search?: string; limit?: number; offset?: number }): Promise<PaginatedResponse<Community>> => {
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
    const response = await api.post(`/communities/${communityId}/join`);
    return response.data;
  },
};

