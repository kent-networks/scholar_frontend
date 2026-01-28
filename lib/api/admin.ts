import api from "@/lib/api";

export interface AdminSummary {
  totalUsers: number;
  activeUsers: number;
  totalCommunities: number;
  totalVideos: number;
}

export const adminApi = {
  getSummary: async (): Promise<AdminSummary> => {
    const response = await api.get("/admin/summary");
    return response.data.data;
  },
};

