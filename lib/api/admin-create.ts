import api from "@/lib/api";

export const adminCreateApi = {
  createAdminUser: async (data: { name: string; email: string; password: string }): Promise<{ id: number; username: string }> => {
    const res = await api.post("/admin/create-admin-user", data);
    return res.data.data;
  },
};

