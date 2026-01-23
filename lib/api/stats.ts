import api from "@/lib/api";

export interface Stats {
  activeResearchers: number;
  researchProjects: number;
  partnerInstitutions: number;
  communityMembers: number;
}

export interface TrendingVideo {
  id: number;
  title: string;
  description?: string;
  category: string;
  image: string;
  author: string;
  views: number;
  date: string;
}

export const statsApi = {
  getStats: async (): Promise<Stats> => {
    const response = await api.get("/stats/stats");
    return response.data.data;
  },

  getTrendingVideos: async (limit?: number): Promise<TrendingVideo[]> => {
    const response = await api.get("/stats/trending", { params: { limit } });
    return response.data.data;
  },
};

