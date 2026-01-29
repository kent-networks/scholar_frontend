import api from "@/lib/api";

export interface AssignedUser {
  id: number;
  username: string;
  name: string;
  profilePhotoPath?: string | null;
}

export interface Institution {
  id: number;
  name: string;
  motto?: string | null;
  createdAt?: string;
  assignedUsersCount?: number;
  assignedUsers?: AssignedUser[];
}

export const institutionsApi = {
  list: async (params?: { search?: string; limit?: number; offset?: number }): Promise<{
    data: Institution[];
    pagination: { total: number; limit: number; offset: number; hasMore: boolean };
  }> => {
    const res = await api.get("/institutions", { params });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  getById: async (id: number): Promise<Institution> => {
    const res = await api.get(`/institutions/${id}`);
    return res.data.data;
  },

  getMyInstitution: async (): Promise<Institution | null> => {
    try {
      const res = await api.get("/institutions/me");
      return res.data.data ?? null;
    } catch (e: any) {
      if (e?.response?.status === 404) return null;
      throw e;
    }
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

  update: async (
    institutionId: number,
    data: { name?: string; motto?: string }
  ): Promise<{ updated: number }> => {
    const res = await api.put(`/institutions/${institutionId}`, data);
    return res.data.data;
  },

  delete: async (institutionId: number): Promise<{ deleted: number }> => {
    const res = await api.delete(`/institutions/${institutionId}`);
    return res.data.data;
  },

  unassignUser: async (
    institutionId: number,
    userId: number
  ): Promise<{ unassigned: number }> => {
    const res = await api.delete(`/institutions/${institutionId}/assign-user`, {
      data: { userId },
    });
    return res.data.data;
  },
};

