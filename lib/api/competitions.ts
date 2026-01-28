import api from "@/lib/api";

export interface Competition {
  id: number;
  title: string;
  description?: string | null;
  institution?: string | null;
  deadline?: string | null;
  isPaid?: boolean;
  createdAt?: string;
}

export interface CompetitionsResponse {
  data: Competition[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const competitionsApi = {
  list: async (params?: { search?: string; limit?: number; offset?: number }): Promise<CompetitionsResponse> => {
    const res = await api.get("/competitions", { params });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  create: async (data: {
    title: string;
    description?: string;
    institution?: string;
    deadline?: string;
    isPaid?: boolean;
  }): Promise<{ id: number }> => {
    const res = await api.post("/competitions", data);
    return res.data.data;
  },

  update: async (
    id: number,
    data: Partial<{
      title: string;
      description?: string;
      institution?: string;
      deadline?: string;
      isPaid?: boolean;
    }>
  ): Promise<{ updated: number }> => {
    const res = await api.put(`/competitions/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<{ deleted: number }> => {
    const res = await api.delete(`/competitions/${id}`);
    return res.data.data;
  },
};

