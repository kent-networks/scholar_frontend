import api from "@/lib/api";

export interface Institution {
  id: number;
  name: string;
  motto?: string | null;
  createdAt?: string;
  assignedUsersCount?: number;
}

export const institutionsApi = {
  list: async (params?: { search?: string; limit?: number; offset?: number }): Promise<{
    data: Institution[];
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  }> => {
    const res = await api.get("/institutions", { params });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  create: async (data: { name: string; motto?: string }): Promise<{ id: number }> => {
    const res = await api.post("/institutions", data);
    return res.data.data;
  },

  assignUser: async (
    institutionId: number,
    data: { userId: number; isInstitutionAdmin?: boolean }
  ): Promise<{ success: true }> => {
    const res = await api.post(`/institutions/${institutionId}/assign-user`, data);
    return res.data.data;
  },
};

